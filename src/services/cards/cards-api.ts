import { baseApi } from '@/services/base-api.ts'
import { Card, CardsResponse, GetCardsArgs } from '@/services/cards/card-types.ts'
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
    createCard: builder.mutation<Card, FormData>({
      query: formData => {
        const id = formData.get('deckId') as string

        formData.delete('deckId')

        return {
          url: `v1/decks/${id}/cards`,
          method: 'POST',
          body: formData,
        }
      },
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState
        const { orderBy, currentPage, itemsPerPage, searchByQuestion, deckId } = state.cardsSlice

        try {
          const res = await queryFulfilled

          dispatch(
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
                if (draft.items.length < itemsPerPage) {
                  draft.items.unshift(res.data)
                } else {
                  draft.items.pop()
                  draft.items.unshift(res.data)
                }
              }
            )
          )
        } catch {}
      },
      invalidatesTags: ['Cards'],
    }),
    updateCard: builder.mutation<Card, FormData>({
      query: formData => {
        const id = formData.get('cardId') as string

        formData.delete('cardId')
        formData.delete('deckId')

        return {
          url: `v1/cards/${id}`,
          method: 'PATCH',
          body: formData,
        }
      },
      async onQueryStarted(formData, { dispatch, getState, queryFulfilled }) {
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
              const questionImg = formData.get('questionImg') as File | null
              const answerImg = formData.get('answerImg') as File | null

              const answer = formData.get('answer') as string
              const question = formData.get('question') as string
              const id = formData.get('cardId') as string

              const cardId = draft.items.findIndex(card => card.id === id)

              draft.items[cardId].question = question
              draft.items[cardId].answer = answer
              if (questionImg) {
                draft.items[cardId].questionImg = URL.createObjectURL(questionImg)
              }
              if (answerImg) {
                draft.items[cardId].answerImg = URL.createObjectURL(answerImg)
              }
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
