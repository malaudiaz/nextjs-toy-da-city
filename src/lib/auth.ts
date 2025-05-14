// lib/authUtils.ts
import { auth } from "@clerk/nextjs/server";
import { verifyToken } from "@clerk/clerk-sdk-node";
import { NextApiRequest } from "next";

export async function getAuthUserFromRequest(req: NextApiRequest) {

  console.log(req.headers);

  const authHeader = req.headers.authorization;

  // Caso 1: Si hay un Bearer token
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split("Bearer ")[1].trim();

    try {
      const decoded = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      return { userId: decoded.sub };
    } catch (error) {
      console.log(error);
      throw new Error("Invalid Bearer token");
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
