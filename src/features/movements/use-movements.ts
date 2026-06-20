import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { movementsService } from "./movements.service"
import type { CreateMovementPayload, TipoMovimentacao } from "@/types/movement"
import { getApiErrorMessage } from "@/shared/utils/api-error"

const movementsKeys = {
  all: ["movements"] as const,
  summary: (tipo: TipoMovimentacao) => [...movementsKeys.all, "summary", tipo] as const,
  detail: (id: number) => [...movementsKeys.all, "detail", id] as const,
}

export function useMovementsSummary(tipo: TipoMovimentacao) {
  return useQuery({
    queryKey: movementsKeys.summary(tipo),
    queryFn: () => movementsService.listSummary(tipo),
    placeholderData: (prev) => prev,
  })
}

export function useAllMovementsSummary() {
  return useQuery({
    queryKey: [...movementsKeys.all, "summary", "all"] as const,
    queryFn: () => movementsService.listAllSummary(),
    placeholderData: (prev) => prev,
  })
}

export function useMovementDetail(id: number | null) {
  return useQuery({
    queryKey: movementsKeys.detail(id ?? 0),
    queryFn: () => movementsService.getById(id!),
    enabled: id !== null,
  })
}

export function useCreateMovement() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateMovementPayload) => movementsService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: movementsKeys.all })
      toast.success("Movimentação registrada com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}
