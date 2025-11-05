import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { getTranslations } from "next-intl/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
  timeout: 10000,
  maxNetworkRetries: 2,
});

interface CartItem {
  id: string;
  name: string;
  price: number; // en dólares
  quantity: number;
  userId: string; // sellerId
}

// Alternativa más simple: usar un ID único basado en el contenido
function generateCartId(cartItems: CartItem[], buyerId: string): string {
  const cartString = JSON.stringify({
    items: cartItems.map(item => ({
      id: item.id,
      price: item.price,
      quantity: item.quantity
    })),
    buyerId
  });
  
  // Crear un hash simple (no criptográfico pero suficiente para este caso)
  let hash = 0;
  for (let i = 0; i < cartString.length; i++) {
    const char = cartString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return `cart_${buyerId}_${Math.abs(hash).toString(36)}`;
}

export async function POST(req: NextRequest) {

  const g = await getTranslations("General");
  const t = await getTranslations("Payments");
  const u = await getTranslations("User");
    
  try {
    const { cartItems, buyerId }: { cartItems: CartItem[]; buyerId: string } = await req.json();

    if (!cartItems?.length || !buyerId) {
      return NextResponse.json({ error: g("InvalidInputParams") }, { status: 400 });
    }

    const cartId = generateCartId(cartItems, buyerId);

    const existingOrder = await prisma.order.findUnique({ where: { cartId, status: { in: ["AWAITING_CONFIRMATION"]}}});

    if (existingOrder) {
      try {
        const intent = await stripe.paymentIntents.retrieve(existingOrder.paymentIntentId);
        // Verificar que el PaymentIntent todavía sea usable
        if (intent.status === 'requires_payment_method' || intent.status === 'requires_confirmation') {
          return NextResponse.json({ clientSecret: intent.client_secret });
        }
      } catch {
        // Si el payment intent no existe en Stripe, continuar con la creación
        console.log("PaymentIntent no encontrado en Stripe, creando uno nuevo");
      }
    }


    // Agrupar por vendedor
    const itemsBySeller = cartItems.reduce((acc, item) => {
      const key = item.userId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    // Obtener cuentas Stripe
    const sellerIds = Object.keys(itemsBySeller);
    const sellers = await prisma.user.findMany({
      where: { id: { in: sellerIds } },
      select: { id: true, stripeAccountId: true },
    });

    const sellerMap = sellers.reduce((acc, s) => {
      acc[s.id] = s.stripeAccountId;
      return acc;
    }, {} as Record<string, string | null | undefined>);

    // Validar cuentas
    for (const sellerId of sellerIds) {
      if (!sellerMap[sellerId]) {
        return NextResponse.json(
          { error: `Vendedor ${sellerId} sin cuenta Stripe` },
          { status: 400 }
        );
      }
    }

    // Calcular totales
    let totalAmount = 0;
    const transferDetails = [];

    for (const [sellerId, items] of Object.entries(itemsBySeller)) {
      const subtotal =
        items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100; // a centavos
      const fee = Math.round(subtotal * 0.01); // 1%
      const net = subtotal - fee;

      totalAmount += subtotal;

      transferDetails.push({
        sellerId,
        stripeAccountId: sellerMap[sellerId],
        amount: Math.round(net),
      });
    }

    // 👇 Manejo específico del error al crear el PaymentIntent
    let paymentIntent: Stripe.Response<Stripe.PaymentIntent>;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          buyer_id: buyerId,
          transfers: JSON.stringify(transferDetails),
        },
      });
    } catch (error) {
      // Tipado seguro del error de Stripe
      if (error instanceof Stripe.errors.StripeError) {
        console.error("Stripe error al crear PaymentIntent:", {
          message: error.message,
          type: error.type,
          code: error.code,
          statusCode: error.statusCode,
        });

        let userMessage = t("PaymentNotProcessed");
        if (error.code === "card_declined") {
          userMessage = t("card_declined");
        } else if (error.code === "insufficient_funds") {
          userMessage = t("insufficient_funds");
        } else if (error.code === "expired_card") {
          userMessage = t("expired_card");
        } else if (error.code === "incorrect_cvc") {
          userMessage = t("incorrect_cvc");
        } else if (error.code === "processing_error") {
          userMessage = t("processing_error");
        } else if (error.type === "StripeInvalidRequestError") {
          userMessage = t("StripeInvalidRequestError");
        }

        // let userMessage = "No se pudo procesar el pago. Inténtalo de nuevo.";
        // if (error.code === "card_declined") {
        //   userMessage = "La tarjeta fue rechazada. Usa otra tarjeta.";
        // } else if (error.code === "insufficient_funds") {
        //   userMessage = "Fondos insuficientes en la tarjeta.";
        // } else if (error.code === "expired_card") {
        //   userMessage = "La tarjeta ha expirado.";
        // } else if (error.code === "incorrect_cvc") {
        //   userMessage = "El código de seguridad (CVC) es incorrecto.";
        // } else if (error.code === "processing_error") {
        //   userMessage = "Error al procesar la tarjeta. Inténtalo más tarde.";
        // } else if (error.type === "StripeInvalidRequestError") {
        //   userMessage = "Datos de pago inválidos.";
        // }

        return NextResponse.json({ error: userMessage }, { status: 400 });
      } else {
        // Error no relacionado con Stripe (red, timeout, etc.)
        console.error("Error inesperado:", error);
        return NextResponse.json(
          { error: t("ErrorConnectingPaymentSystem") },
          { status: 500 }
        );
      }
    }

    // Buscar los juguetes reales en la base de datos
    const toyIds = cartItems.map((item) => item.id);
    const toys = await prisma.toy.findMany({
      where: { id: { in: toyIds } },
    });

    // Validar que todos existan
    if (toys.length !== cartItems.length) {
      const foundIds = new Set(toys.map((t) => t.id));
      const missing = cartItems
        .map((c) => c.id)
        .filter((id) => !foundIds.has(id));
      return NextResponse.json(
        { error: `Juguetes no encontrados: ${missing.join(", ")}` },
        { status: 404 }
      );
    }

    const buller = await prisma.user.findUnique({
      where: { clerkId: buyerId },
      select: { id: true, name: true },
    });

    if (!buller) {
      return NextResponse.json({ error: u("NotFound") }, { status: 404 });
    }

    // Si existe una orden anterior con el mismo cartId pero PaymentIntent inválido, actualizarla
    if (existingOrder) {
      await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          paymentIntentId: paymentIntent.id,
          totalAmount,
          status: "AWAITING_CONFIRMATION",
        },
      });
    } else {
      // Crear nueva orden
      await prisma.order.create({
        data: {
          cartId,
          paymentIntentId: paymentIntent.id,
          buyerId: buller.id,
          sellerId: transferDetails[0].sellerId,
          totalAmount,
          status: "AWAITING_CONFIRMATION",
          items: {
            create: cartItems.map(item => ({
              toy: { connect: { id: item.id } },
              priceAtPurchase: Math.round(item.price * 100),
            })),
          },
        },
      });
    }

    // ✅ ACTUALIZAR LOS JUGUETES: forSell = false, active = false
    await prisma.toy.updateMany({
      where: { id: { in: toyIds } },
      data: {
        statusId: 2, // reserved
        isActive: true
      },
    });   
     

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creando PaymentIntent:", error);
    return NextResponse.json({ error: g("ServerError") }, { status: 500 });
  }
}
