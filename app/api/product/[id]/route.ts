import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

async function fetchProductById(productId: string) {
  return await db.product.findUnique({ where: { id: productId } })
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const productId = params.id
  if (!productId) {
    return NextResponse.json(
      { error: "Product ID not provided" },
      { status: 400 }
    )
  }

  try {
    const product = await fetchProductById(productId)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error("GET Product Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const productId = params.id
  if (!productId) {
    return NextResponse.json(
      { error: "Product ID not provided" },
      { status: 400 }
    )
  }

  try {
    const data = await req.json()
    if (data.isActive) {
      const activeProduct = await db.product.findFirst({
        where: { isActivated: true },
      })

      if (activeProduct && activeProduct.id !== productId) {
        await db.product.updateMany({ data: { isActivated: false } })
      }
    }

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        sellerId: data.sellerId,
        name: data.name,
        date: data.date ?? new Date(),
        price: data.price,
        quantity: data.quantity,
        isPaid: data.isPaid ?? false,
        isActivated: data.isActivated ?? true,
      },
    })

    return NextResponse.json(updatedProduct, { status: 200 })
  } catch (error) {
    console.error("PATCH Product Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const productId = params.id
  if (!productId) {
    return NextResponse.json(
      { error: "Product ID not provided" },
      { status: 400 }
    )
  }

  try {
    const deletedProduct = await db.product.delete({ where: { id: productId } })
    return NextResponse.json(deletedProduct, { status: 200 })
  } catch (error) {
    console.error("DELETE Product Error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
