import { NextResponse } from "next/server";
import { auth } from "../../../../auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ session });

    response.headers.set(
      "Cache-Control",
      "private, max-age=60, stale-while-revalidate=300"
    );

    return response;
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
