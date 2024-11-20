import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

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
    const { isActivated } = await req.json()

    // Eğer aktif Product ayarlanacaksa, sadece gerekli durumda güncelle
    if (isActivated) {
      const activeProduct = await db.product.findFirst({
        where: { isActivated: true },
      })

      if (activeProduct && activeProduct.id !== productId) {
        await db.product.updateMany({ data: { isActivated: false } })
      }
    }

    // İlgili Product'ı güncelle
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: { isActivated },
    })

    return NextResponse.json(updatedProduct, { status: 201 })
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
