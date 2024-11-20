import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verifyAuthorization } from "@/lib/verify-api"

const handleError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status })

const withAuthorization = async (
  req: NextRequest,
  ids: string[],
  handler: (ids: string[], req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> => {
  const authResponse = await verifyAuthorization(req)
  if (authResponse) return authResponse

  if (ids.length === 0) {
    return handleError("Product IDs missing or invalid", 400)
  }

  try {
    return await handler(ids, req)
  } catch (error) {
    console.error("Server Error:", error)
    return handleError("Internal Server Error", 500)
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { ids: string } }
) {
  const ids = params.ids
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)

  return withAuthorization(req, ids, async (ids) => {
    const deleteProducts = await db.product.deleteMany({
      where: { id: { in: ids } },
    })

    if (deleteProducts.count === 0) {
      return handleError("No products found to delete", 404)
    }

    return NextResponse.json(deleteProducts, { status: 200 })
  })
}
