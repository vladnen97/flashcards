import { baseApi } from '@/services/base-api.ts'
import {
  Card,
  CardsResponse,
  CreateCardArgs,
  DeleteCardArgs,
  GetCardsArgs,
  UpdateCardArgs,
} from '@/services/cards/card-types.ts'
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
    deleteCard: builder.mutation<void, DeleteCardArgs>({
      query: ({ id }) => ({
        url: `v1/cards/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ id, deckId }, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState
        const { orderBy, currentPage, itemsPerPage, searchByQuestion } = state.cardsSlice

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
    createCard: builder.mutation<Card, CreateCardArgs>({
      query: ({ id, ...data }) => {
        const formData = new FormData()

        formData.append('answer', data.answer)
        formData.append('question', data.question)
        data.questionImg && formData.append('questionImg', data.questionImg)
        data.answerImg && formData.append('answerImg', data.answerImg)

        return {
          url: `v1/decks/${id}/cards`,
          method: 'POST',
          body: formData,
        }
      },
      async onQueryStarted({ id }, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState
        const { orderBy, currentPage, itemsPerPage, searchByQuestion } = state.cardsSlice

        try {
          const res = await queryFulfilled

          dispatch(
            cardsApi.util.updateQueryData(
              'getCards',
              {
                id,
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
    updateCard: builder.mutation<Card, UpdateCardArgs>({
      query: ({ id, deckId, ...data }) => {
        const formData = new FormData()

        formData.append('answer', data.answer)
        formData.append('question', data.question)
        data.questionImg && formData.append('questionImg', data.questionImg)
        data.answerImg && formData.append('answerImg', data.answerImg)

        return {
          url: `v1/cards/${id}`,
          method: 'PATCH',
          body: formData,
        }
      },
      async onQueryStarted({ id, deckId, ...patch }, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState
        const { orderBy, currentPage, itemsPerPage, searchByQuestion } = state.cardsSlice

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
              if (patch.questionImg) {
                draft.items[cardId].questionImg = URL.createObjectURL(patch.questionImg)
              }
              if (patch.answerImg) {
                draft.items[cardId].answerImg = URL.createObjectURL(patch.answerImg)
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
