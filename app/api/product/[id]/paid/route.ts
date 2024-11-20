import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

const handleError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status })

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const productId = params.id

  if (!productId) {
    return handleError("Product ID not provided", 400)
  }

  try {
    const { isPaid } = await req.json()

    if (typeof isPaid !== "boolean") {
      return handleError("Invalid or missing 'isPaid' field", 400)
    }

    const existingProduct = await db.product.findUnique({
      where: { id: productId },
    })

    if (!existingProduct) {
      return handleError("Product not found", 404)
    }

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: { isPaid },
    })

    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (error) {
    console.error("Product update error:", error)
    return handleError("Error updating product", 500)
  }
}
