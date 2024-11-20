import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

const handleError = (message: string, status: number) =>
  new NextResponse(JSON.stringify({ error: message }), { status })

export async function GET(req: NextRequest) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  try {
    const sellers = await db.seller.findMany()
    return new NextResponse(JSON.stringify(sellers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching sellers:", error)
    return handleError("Server error", 500)
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  try {
    const data = await req.json()

    const newSeller = await db.seller.create({
      data,
    })

    return NextResponse.json(newSeller, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return new NextResponse(JSON.stringify({ error: "Server error" }), {
      status: 500,
    })
  }
}
