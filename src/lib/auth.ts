// lib/authUtils.ts
import { auth } from "@clerk/nextjs/server";
import { verifyToken } from "@clerk/clerk-sdk-node";
import { NextApiRequest } from "next";

export async function getAuthUserFromRequest(req: NextApiRequest) {

  if (req.headers instanceof Headers) {
   
    const headers = Object.fromEntries(req.headers?.entries());

    const authHeader = headers["authorization"];

    // Caso 1: Si hay un Bearer token
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1].trim();

      const issuer = process.env.CLERK_ISSUEER;

      if (!issuer) {
        throw new Error("CLERK_JWT_ISSUER no está definido");
      }

      try {
        const decoded = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY,
          issuer: issuer,
        });

        return { userId: decoded.sub };
      } catch (error) {
        console.log(error);
        throw new Error("Invalid Bearer token");
      }
    }
  }

  // Caso 2: Si viene del navegador, usa `auth()` (lee las cookies)
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("No user found in session");

    return { userId };
  } catch (error) {
    console.log(error);
    throw new Error("Not authenticated");
  }

}
