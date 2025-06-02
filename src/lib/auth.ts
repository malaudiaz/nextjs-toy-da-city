// lib/authUtils.ts
import { auth } from "@clerk/nextjs/server";
import { verifyToken } from "@clerk/clerk-sdk-node";

declare interface AuthResponse {
  success: boolean
  userId?: string,
  error: string
  code?: number
}

export async function getAuthUserFromRequest(req: Request): Promise<AuthResponse> {

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

        return { success: true, userId: decoded.sub, error: "", code: 200 };
      } catch (error) {
        console.log(error);
        return { success: false, userId: "", error: "Invalid Bearer token", code: 401 };
      }
    }
  }

  // Caso 2: Si viene del navegador, usa `auth()` (lee las cookies)
  try {
    const { userId } = await auth();
    if (!userId) {
        return { success: false, userId: "", error: "No user found in session", code: 401 };
    }

    return { success: true, userId: userId!, error: "", code: 200 };
  } catch (error) {
    console.log(error);
      return { success: false, userId: "", error: "Not Authenticate", code: 401 };
  }

}
