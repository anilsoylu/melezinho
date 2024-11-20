import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ids: string } }
) {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  const multiIds =
    params.ids
      ?.split(",")
      .map((id) => id.trim())
      .filter(Boolean) || []

  if (multiIds.length === 0) {
    return NextResponse.json({ error: "Seller IDs missing" }, { status: 400 })
  }

  try {
    const deleteSellers = await db.seller.deleteMany({
      where: { id: { in: multiIds } },
    })

    if (deleteSellers.count === 0) {
      return NextResponse.json(
        { error: "No Seller found to delete" },
        { status: 404 }
      )
    }

    return NextResponse.json(deleteSellers, { status: 201 })
  } catch (error) {
    console.error("IBAN deletion error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
