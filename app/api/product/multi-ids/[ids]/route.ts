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
    return NextResponse.json({ error: "Product IDs missing" }, { status: 400 })
  }

  try {
    const deleteProducts = await db.product.deleteMany({
      where: { id: { in: multiIds } },
    })

    if (deleteProducts.count === 0) {
      return NextResponse.json(
        { error: "No Product found to delete" },
        { status: 404 }
      )
    }

    return NextResponse.json(deleteProducts, { status: 201 })
  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
