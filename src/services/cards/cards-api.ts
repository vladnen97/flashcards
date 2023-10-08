import { baseApi } from '@/services/base-api.ts'
import { Pagination } from '@/services/decks'

const cardsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCards: builder.query<CardsResponse, GetCardsArgs>({
      query: ({ id, ...params }) => ({
        url: `v1/decks/${id}/cards`,
        method: 'GET',
        params,
      }),
      providesTags: ['Cards'],
    }),
    deleteCard: builder.mutation<void, string>({
      query: id => ({
        url: `v1/cards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cards'],
    }),
    createCard: builder.mutation<Card, CardRequestBody>({
      query: ({ id, ...body }) => ({
        url: `v1/decks/${id}/cards`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cards'],
    }),
    updateCard: builder.mutation<Card, CardRequestBody>({
      query: ({ id, ...body }) => ({
        url: `v1/cards/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Cards'],
    }),
  }),
})

export const {
  useGetCardsQuery,
  useDeleteCardMutation,
  useCreateCardMutation,
  useUpdateCardMutation,
} = cardsApi

type GetCardsArgs = {
  id: string
  question?: string
  answer?: string
  orderBy?: string | null
  currentPage?: number
  itemsPerPage?: string
}
type CardRequestBody = {
  id: string
  question: string
  answer: string
  questionImg?: string
  answerImg?: string
  questionVideo?: string
  answerVideo?: string
}

export type CardsResponse = {
  pagination: Pagination
  items: Card[]
}

export type Card = {
  id: string
  question: string
  answer: string
  deckId: string
  questionImg: string | null
  answerImg: string | null
  questionVideo: string | null
  answerVideo: string | null
  created: string
  updated: string
  shots: number
  grade: number
  userId: string
}
