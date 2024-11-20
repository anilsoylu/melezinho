import { NextRequest, NextResponse } from "next/server"

const secret_token = process.env.NEXT_PUBLIC_API_SECRET_TOKEN

async function verifyAuthorization(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (!authHeader || authHeader !== secret_token) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
  return null
}

export { verifyAuthorization }
