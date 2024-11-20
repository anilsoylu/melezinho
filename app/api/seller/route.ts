import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

const handleError = (message: string, status: number) =>
  new NextResponse(JSON.stringify({ error: message }), { status })

const withAuthorization = async (
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> => {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse
  try {
    return await handler(req)
  } catch (error) {
    console.error("Server Error:", error)
    return handleError("Internal Server Error", 500)
  }
}

export async function GET(req: NextRequest) {
  return withAuthorization(req, async () => {
    const sellers = await db.seller.findMany()
    return NextResponse.json(sellers, { status: 200 })
  })
}

export async function POST(req: NextRequest) {
  return withAuthorization(req, async () => {
    const data = await req.json()

    if (!data.name || typeof data.name !== "string") {
      return handleError("Invalid input data", 400)
    }

    const newSeller = await db.seller.create({ data })
    return NextResponse.json(newSeller, { status: 201 })
  })
}
