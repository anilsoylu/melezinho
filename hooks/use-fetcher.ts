import ky from "ky"

const secret_token = process.env.NEXT_PUBLIC_API_SECRET_TOKEN
const app_url = process.env.NEXT_PUBLIC_APP_URL

export const kyFetcher = async <T extends object>(
  url: string,
  modelType?: new () => T,
  options?: RequestInit
): Promise<T> => {
  const api = ky.create({
    retry: 2, // 2 kez yeniden dene
    timeout: 5000, // 5 saniye zaman aşımı
  })

  const response = await api.get(app_url + url, {
    headers: {
      authorization: secret_token || "",
    },
    ...options,
  })

  const data = await response.json<T>()

  return modelType ? Object.assign(new modelType(), data) : data
}

export const fetcher = <T>(url: string): Promise<T> => {
  return fetch(app_url + url, {
    headers: {
      authorization: secret_token || "",
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch data")
    }
    return res.json()
  })
}

export const customFetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(app_url + url, {
    headers: {
      authorization: secret_token || "",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch data")
  }

  return response.json() as T // TypeScript’e JSON’un dönüş tipini bildirdik
}
