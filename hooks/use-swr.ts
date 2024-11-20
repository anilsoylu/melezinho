import useSWR from "swr"
import { fetcher, kyFetcher } from "@/hooks/use-fetcher"

function useFetcher<T extends object>(
  url: string,
  fetcherOption: "fetch" | "ky" = "fetch", // Choose between fetch or ky
  modelType?: new () => T // Optionally pass a model type
) {
  const selectedFetcher =
    fetcherOption === "fetch"
      ? () => fetcher<T>(url)
      : () => kyFetcher<T>(url, modelType)

  const { data, error } = useSWR<T>(url, selectedFetcher)

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

export default useFetcher
