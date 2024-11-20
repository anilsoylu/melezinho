import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

const handleError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status })

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
    const products = await db.product.findMany({
      include: { seller: true },
    })

    return NextResponse.json(products, { status: 200 })
  })
}

export async function POST(req: NextRequest) {
  return withAuthorization(req, async (req) => {
    const data = await req.json()

    if (!data.sellerId || !data.title || !data.price || !data.quantity) {
      return handleError(
        "Missing required fields: sellerId, title, price, or quantity",
        400
      )
    }

    const seller = await db.seller.findUnique({
      where: { id: data.sellerId },
    })

    if (!seller) {
      return handleError("Invalid sellerId: Seller not found", 404)
    }

    const newProduct = await db.product.create({
      data: {
        sellerId: seller.id,
        title: data.title,
        date: data.date ?? new Date(),
        price: data.price,
        quantity: data.quantity,
        isPaid: data.isPaid ?? false,
        isActivated: data.isActivated ?? true,
      },
    })

    return NextResponse.json(newProduct, { status: 201 })
  })
}
