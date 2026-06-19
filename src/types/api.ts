export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export interface Paginated<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
