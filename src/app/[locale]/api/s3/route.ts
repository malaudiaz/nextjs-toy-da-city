import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const region = process.env.AWS_BUCKET_REGION || "";
const accessKeyId = process.env.AWS_ACCESS_KEY || "";
const secretAccessKey = process.env.AWS_SECRET_KEY || "";
const bucketName = process.env.AWS_BUCKET_NAME || "";

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function POST(req: NextRequest) {
  try {
    if (!bucketName) {
      return NextResponse.json(
        { success: false, message: "Bucket name not configured" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image");

    if (!image || typeof image !== "object" || !image.name) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    const Body = new Uint8Array(await image.arrayBuffer());
    const params = {
      Bucket: bucketName,
      Key: image.name,
      Body,
      ContentType: image.type,
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    // URL pública a través de CloudFront
    const url = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${image.name}`;

    return NextResponse.json({
      success: true,
      message: "Successfully image uploaded",
      data: { url },
    });
  } catch (error) {
    console.error("S3 upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}