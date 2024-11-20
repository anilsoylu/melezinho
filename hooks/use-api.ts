import { useCallback } from "react"

interface FetchApiConfig {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  headers: HeadersInit
  body?: string
}

const useApi = (basePath: string = "/api") => {
  const secretToken: string | undefined =
    process.env.NEXT_PUBLIC_API_SECRET_TOKEN

  const fetchApi = useCallback(
    async (
      endpoint: string,
      method: "GET" | "POST" | "PATCH" | "DELETE" = "GET",
      body: any = null
    ): Promise<[any, Error | null]> => {
      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: secretToken || "",
      })

      const config: RequestInit = {
        method,
        headers,
      }

      if (body) {
        config.body = JSON.stringify(body)
      }

      try {
        const response = await fetch(`${basePath}${endpoint}`, config)
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || "Something went wrong")
        }
        return [data, null]
      } catch (error) {
        console.error("API call error:", error)
        return [
          null,
          error instanceof Error ? error : new Error("Unknown error"),
        ]
      }
    },
    [basePath, secretToken]
  )

  const listApi = (folder: string) => fetchApi(`/${folder}`)
  const deleteApi = (id: string, folder: string) =>
    fetchApi(`/${folder}/${id}`, "DELETE")
  const createApi = (folder: string, data: any) =>
    fetchApi(`/${folder}`, "POST", data)
  const updateApi = (id: string, folder: string, data: any) =>
    fetchApi(`/${folder}/${id}`, "PATCH", data)
  const resetApi = (folder: string) => fetchApi(`/${folder}/reset`, "PATCH")
  const updateApiMarkAsRead = (id: string, folder: string, data: any) =>
    fetchApi(`/${folder}/${id}/mark-as-read`, "PATCH", data)
  const updateAvailableApi = (id: string, folder: string, data: any) =>
    fetchApi(`/${folder}/${id}/status`, "PATCH", data)
  const updateUseApi = (id: string, folder: string, data: any) =>
    fetchApi(`/${folder}/${id}/use`, "PATCH", data)
  const update2faApi = (id: string, folder: string, data: any) =>
    fetchApi(`/${folder}/${id}/2fa`, "PATCH", data)
  const updateLanguagePanelApi = (id: string, folder: string, data: any) =>
    fetchApi(`/${folder}/${id}/panel`, "PATCH", data)
  const updateLanguageDefaultApi = (id: string, folder: string, data: any) =>
    fetchApi(`/${folder}/${id}/default`, "PATCH", data)
  const updateOrderByApi = (id: string, folder: string, data: any) =>
    fetchApi(`/${folder}/${id}/order`, "PATCH", data)
  const deleteMultiIdsApi = (ids: string, folder: string) => {
    return fetchApi(`/${folder}/multi-ids/${ids}`, "DELETE")
  }
  const deleteMultiPageIdsApi = (ids: string, folder: string) => {
    return fetchApi(`/${folder}/multi-ids/pageId/${ids}`, "DELETE")
  }

  return {
    listApi,
    deleteApi,
    createApi,
    updateApi,
    resetApi,
    updateAvailableApi,
    updateUseApi,
    update2faApi,
    updateOrderByApi,
    deleteMultiIdsApi,
    deleteMultiPageIdsApi,
    updateLanguagePanelApi,
    updateLanguageDefaultApi,
    updateApiMarkAsRead,
  }
}

export default useApi