import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { categoriesService, type ListCategoriesParams } from "./categories.service"
import type { CreateCategoryPayload, UpdateCategoryPayload, Category } from "@/types/category"
import { getApiErrorMessage } from "@/shared/utils/api-error"

const categoriesKeys = {
  all: ["categories"] as const,
  list: (params: ListCategoriesParams) => [...categoriesKeys.all, "list", params] as const,
}

export function useCategories(params: ListCategoriesParams = {}) {
  return useQuery({
    queryKey: categoriesKeys.list(params),
    queryFn: () => categoriesService.list(params),
    placeholderData: (prev) => prev,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCategoryPayload) => categoriesService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriesKeys.all })
      toast.success("Categoria criada com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryPayload }) => categoriesService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriesKeys.all })
      toast.success("Categoria atualizada com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoriesService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoriesKeys.all })
      toast.success("Categoria removida com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}
