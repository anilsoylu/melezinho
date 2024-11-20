import PageClient from "./page.client"

export async function generateMetadata() {
  return {
    title: "Yeni Token Oluştur",
    description: "Yeni Token Oluştur",
  }
}

const TokenCreatePage = () => {
  return <PageClient />
}

export default TokenCreatePage
