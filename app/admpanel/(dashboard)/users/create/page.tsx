import PageClient from "./page.client"

export async function generateMetadata() {
  return {
    title: "Yeni Satıcı Ekle",
    description: "Yeni Satıcı Ekle",
  }
}

const UserCreate = () => {
  return <PageClient />
}

export default UserCreate
