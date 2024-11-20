import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

const handleError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status })

const withAuthorization = async (
  req: NextRequest,
  productId: string,
  handler: (productId: string, req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> => {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  if (!productId) {
    return handleError("Product ID not provided", 400)
  }

  try {
    return await handler(productId, req)
  } catch (error) {
    console.error("Server Error:", error)
    return handleError("Internal Server Error", 500)
  }
}

async function fetchProductById(productId: string) {
  return db.product.findUnique({ where: { id: productId } })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthorization(req, params.id, async (productId) => {
    const product = await fetchProductById(productId)
    if (!product) {
      return handleError("Product not found", 404)
    }
    return NextResponse.json(product, { status: 200 })
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthorization(req, params.id, async (productId) => {
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

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        sellerId: seller.id,
        title: data.title,
        date: data.date,
        price: data.price,
        quantity: data.quantity,
        isPaid: data.isPaid ?? false,
        isActivated: data.isActivated ?? true,
      },
    })

    return NextResponse.json(updatedProduct, { status: 200 })
  })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuthorization(req, params.id, async (productId) => {
    const deletedProduct = await db.product.delete({ where: { id: productId } })
    return NextResponse.json(deletedProduct, { status: 200 })
  })
}
