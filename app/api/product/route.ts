import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

const handleError = (message: string, status: number) =>
  new NextResponse(JSON.stringify({ error: message }), { status })

export async function GET(req: NextRequest) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  try {
    const products = await db.product.findMany()
    return new NextResponse(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return handleError("Server error", 500)
  }
}

export async function POST(req: NextRequest) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  try {
    const data = await req.json()

    const newProduct = await db.product.create({
      data: {
        sellerId: data.sellerId,
        date: data.date ?? new Date(),
        price: data.price,
        quantity: data.quantity,
        isPaid: data.isPaid ?? false,
        isActivated: data.isActivated ?? true,
      },
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating products:", error)
    return new NextResponse(JSON.stringify({ error: "Server error" }), {
      status: 500,
    })
  }
}
