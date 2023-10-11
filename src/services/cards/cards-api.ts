import { baseApi } from '@/services/base-api.ts'
import { Card, CardRequestArgs, CardsResponse, GetCardsArgs } from '@/services/cards/card-types.ts'

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
    createCard: builder.mutation<Card, CardRequestArgs>({
      query: ({ id, ...body }) => ({
        url: `v1/decks/${id}/cards`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cards'],
    }),
    updateCard: builder.mutation<Card, CardRequestArgs>({
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
