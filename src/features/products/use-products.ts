import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { productsService, type ListProductsParams } from "./products.service"
import type { CreateProductPayload, UpdateProductPayload, Product } from "@/types/product"
import { getApiErrorMessage } from "@/shared/utils/api-error"

const productsKeys = {
  all: ["products"] as const,
  list: (params: ListProductsParams) => [...productsKeys.all, "list", params] as const,
}

export function useProducts(params: ListProductsParams) {
  return useQuery({
    queryKey: productsKeys.list(params),
    queryFn: () => productsService.list(params),
    placeholderData: (prev) => prev,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateProductPayload) => productsService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productsKeys.all })
      toast.success("Produto criado com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateProductPayload }) => productsService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productsKeys.all })
      toast.success("Produto atualizado com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productsKeys.all })
      toast.success("Produto removido com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}
