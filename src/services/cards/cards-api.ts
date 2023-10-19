import { baseApi } from '@/services/base-api.ts'
import { Card, CardRequestArgs, CardsResponse, GetCardsArgs } from '@/services/cards/card-types.ts'
import { RootState } from '@/services/store.ts'

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
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState
        const { orderBy, currentPage, itemsPerPage, searchByQuestion, deckId } = state.cardsSlice

        const patchResult = dispatch(
          cardsApi.util.updateQueryData(
            'getCards',
            {
              id: deckId,
              question: searchByQuestion,
              currentPage,
              itemsPerPage,
              orderBy: !orderBy ? null : `${orderBy?.key}-${orderBy?.direction}`,
            },
            draft => {
              const cardId = draft.items.findIndex(card => card.id === id)

              draft.items.splice(cardId, 1)
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
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
      async onQueryStarted({ id, ...patch }, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState
        const { orderBy, currentPage, itemsPerPage, searchByQuestion, deckId } = state.cardsSlice

        const patchResult = dispatch(
          cardsApi.util.updateQueryData(
            'getCards',
            {
              id: deckId,
              question: searchByQuestion,
              currentPage,
              itemsPerPage,
              orderBy: !orderBy ? null : `${orderBy?.key}-${orderBy?.direction}`,
            },
            draft => {
              const cardId = draft.items.findIndex(card => card.id === id)

              draft.items[cardId].question = patch.question
              draft.items[cardId].answer = patch.answer
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
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
