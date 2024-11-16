import { hash } from "bcryptjs"
import { db } from "./db"

async function seed() {
  const username = process.env.ADMIN_USERNAME || ""
  const password = process.env.ADMIN_PASSWORD || ""
  const passwordHash = await hash(password, 10)

  await db.user.create({
    data: {
      username,
      password: passwordHash,
      image: "/dashboard/admin.png",
      isActivated: true,
      isAdmin: true,
    },
  })
}

seed()
  .catch((error) => {
    console.error("Seed process failed:", error)
    process.exit(1)
  })
  .finally(() => {
    console.log("Seed process finished. Exiting...")
    process.exit(0)
  })
