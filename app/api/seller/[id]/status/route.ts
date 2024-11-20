import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const sellerId = params.id

  if (!sellerId) {
    return NextResponse.json(
      { error: "Seller ID not provided" },
      { status: 400 }
    )
  }

  try {
    const { isActivated } = await req.json()

    // Eğer aktif Seller ayarlanacaksa, sadece gerekli durumda güncelle
    if (isActivated) {
      const activeSeller = await db.seller.findFirst({
        where: { isActivated: true },
      })

      if (activeSeller && activeSeller.id !== sellerId) {
        await db.seller.updateMany({ data: { isActivated: false } })
      }
    }

    // İlgili Seller'ı güncelle
    const updatedSeller = await db.seller.update({
      where: { id: sellerId },
      data: { isActivated },
    })

    return NextResponse.json(updatedSeller, { status: 201 })
  } catch (error) {
    console.error("Seller update error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
