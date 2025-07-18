import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imageKit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file found" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();

  try {
    const response = await imageKit.upload({
      file: Buffer.from(buffer),
      fileName: file.name,
      folder: "/profile_images/",
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}