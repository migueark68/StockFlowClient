import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { stockService } from "./stock.service"
import type { UpdateStockPayload } from "@/types/stock"
import { getApiErrorMessage } from "@/shared/utils/api-error"

const stockKeys = {
  all: ["stock"] as const,
  list: () => [...stockKeys.all, "list"] as const,
  detail: (id: number) => [...stockKeys.all, "detail", id] as const,
}

export function useStock() {
  return useQuery({
    queryKey: stockKeys.list(),
    queryFn: () => stockService.list(),
    placeholderData: (prev) => prev,
  })
}

export function useUpdateStock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateStockPayload }) =>
      stockService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: stockKeys.all })
      toast.success("Estoque atualizado com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}
