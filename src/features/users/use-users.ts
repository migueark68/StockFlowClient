import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { usersService, type ListUsersParams } from "./users.service"
import type { CreateUserInput, UpdateUserInput, User } from "@/types/user"
import type { Paginated } from "@/types/api"
import { getApiErrorMessage } from "@/shared/utils/api-error"

const usersKeys = {
  all: ["users"] as const,
  list: (params: ListUsersParams) => [...usersKeys.all, "list", params] as const,
}

function normalizeList(data: Paginated<User> | User[]): { items: User[]; total: number } {
  if (Array.isArray(data)) return { items: data, total: data.length }
  return { items: data.data, total: data.total ?? data.data.length }
}

export function useUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.list(params),
    select: normalizeList,
    placeholderData: (prev) => prev,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersService.create(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all })
      toast.success("Usuário criado com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) => usersService.update(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all })
      toast.success("Usuário atualizado com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.all })
      toast.success("Usuário removido com sucesso")
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  })
}
