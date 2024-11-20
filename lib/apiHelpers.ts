const secretToken = process.env.NEXT_PUBLIC_API_SECRET_TOKEN

const fetchData = async (endpoint: string, method: string) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: secretToken || "",
  }

  try {
    const response = await fetch(endpoint, {
      method: method,
      headers: headers,
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }
    return [data, null]
  } catch (error) {
    console.error("API call error:", error)
    return [null, error instanceof Error ? error : new Error("Unknown error")]
  }
}

export const customFetchData = async (endpoint: string, method: string) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: secretToken || "",
  }

  try {
    const response = await fetch(endpoint, {
      method: method,
      headers: headers,
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong")
    }
    return [data, null]
  } catch (error) {
    console.error("API call error:", error)
    return [null, error instanceof Error ? error : new Error("Unknown error")]
  }
}

export const handleDelete = async (id: string, folder: string) => {
  const endpoint = `/api/${folder}/${id}`
  return await fetchData(endpoint, "DELETE")
}

export const handlePageIdDelete = async (id: string, folder: string) => {
  const endpoint = `/api/${folder}/multi-ids/pageId/${id}`
  return await fetchData(endpoint, "DELETE")
}
