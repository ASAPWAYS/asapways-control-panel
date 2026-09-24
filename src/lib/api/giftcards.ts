import type { Requester } from "@/lib/api/users"

export type GiftcardApiStatus = "ACTIVE" | "INACTIVE"

export interface CreateCategoryPayload {
  name: string
  image: File
  previewImage: File
  sortOrder?: number
  status?: GiftcardApiStatus
}

export interface UpdateCategoryPayload {
  name?: string
  image?: File
  previewImage?: File
  sortOrder?: number
  status?: GiftcardApiStatus
}

export interface CreateSubCategoryPayload {
  name: string
  rate: number
  minimumAmount: number
  maximumAmount: number
  status?: GiftcardApiStatus
  terms?: string
  highRate?: boolean
  waitTime?: number
  sortOrder?: number
  image?: File
}

export type UpdateSubCategoryPayload = Partial<CreateSubCategoryPayload>

function toFormData(payload: object): FormData {
  const form = new FormData()
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue
    if (value instanceof File) {
      form.append(key, value)
    } else if (typeof value === "boolean") {
      form.append(key, value ? "true" : "false")
    } else {
      form.append(key, String(value))
    }
  }
  return form
}

async function createGiftcardCategory(request: Requester, payload: CreateCategoryPayload) {
  return request("/giftcards/categories", {
    method: "POST",
    formData: toFormData(payload),
  })
}

async function updateGiftcardCategory(
  request: Requester,
  categoryId: string,
  payload: UpdateCategoryPayload
) {
  return request(`/giftcards/categories/${categoryId}`, {
    method: "PATCH",
    formData: toFormData(payload),
  })
}

async function deleteGiftcardCategory(request: Requester, categoryId: string) {
  return request(`/giftcards/categories/${categoryId}`, { method: "DELETE" })
}

async function createGiftcardSubCategory(
  request: Requester,
  categoryId: string,
  payload: CreateSubCategoryPayload
) {
  return request(`/giftcards/categories/${categoryId}/sub-categories`, {
    method: "POST",
    formData: toFormData(payload),
  })
}

async function updateGiftcardSubCategory(
  request: Requester,
  subCategoryId: string,
  payload: UpdateSubCategoryPayload
) {
  return request(`/giftcards/sub-categories/${subCategoryId}`, {
    method: "PATCH",
    formData: toFormData(payload),
  })
}

async function deleteGiftcardSubCategory(request: Requester, subCategoryId: string) {
  return request(`/giftcards/sub-categories/${subCategoryId}`, { method: "DELETE" })
}

export {
  createGiftcardCategory,
  updateGiftcardCategory,
  deleteGiftcardCategory,
  createGiftcardSubCategory,
  updateGiftcardSubCategory,
  deleteGiftcardSubCategory,
}
