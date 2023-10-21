import { baseApi } from '../base-api.ts'

import { Card } from '@/services/cards/card-types.ts'
import {
  Deck,
  DecksResponse,
  DeckWithAuthor,
  GetDecksArgs,
  GetLearnArgs,
  SaveGradeArgs,
} from '@/services/decks/deck-types.ts'
import { RootState } from '@/services/store.ts'

const decksApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getDecks: builder.query<DecksResponse, GetDecksArgs>({
      query: args => ({
        url: 'v1/decks',
        method: 'GET',
        params: args,
      }),
      providesTags: ['Decks'],
    }),
    getDeckById: builder.query<Deck, string>({
      query: id => ({
        url: `v1/decks/${id}`,
        method: 'GET',
      }),
      providesTags: ['Decks'],
    }),
    createDeck: builder.mutation<DeckWithAuthor, FormData>({
      query: body => ({
        url: 'v1/decks',
        method: 'POST',
        body,
      }),
      async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState
        const { orderBy, cardsCount, currentPage, itemsPerPage, authorId, searchByName } =
          state.deckSlice

        try {
          const res = await queryFulfilled

          dispatch(
            decksApi.util.updateQueryData(
              'getDecks',
              {
                name: searchByName,
                itemsPerPage,
                currentPage,
                authorId,
                maxCardsCount: cardsCount[1],
                minCardsCount: cardsCount[0],
                orderBy: !orderBy ? null : `${orderBy?.key}-${orderBy?.direction}`,
              },
              draft => {
                draft.items.pop()
                draft.items.unshift(res.data)
              }
            )
          )
        } catch {}
      },
      invalidatesTags: ['Decks'],
    }),
    deleteDeck: builder.mutation<Deck, string>({
      query: id => ({
        url: `v1/decks/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState
        const { orderBy, cardsCount, currentPage, itemsPerPage, authorId, searchByName } =
          state.deckSlice

        const patchResult = dispatch(
          decksApi.util.updateQueryData(
            'getDecks',
            {
              name: searchByName,
              itemsPerPage,
              currentPage,
              authorId,
              maxCardsCount: cardsCount[1],
              minCardsCount: cardsCount[0],
              orderBy: !orderBy ? null : `${orderBy?.key}-${orderBy?.direction}`,
            },
            draft => {
              draft.items = draft.items.filter(deck => deck.id !== id)
            }
          )
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: ['Decks'],
    }),
    updateDeck: builder.mutation<DeckWithAuthor, FormData>({
      query: formData => {
        const id = formData.get('deckId')

        formData.delete('deckId')

        return {
          url: `v1/decks/${id}`,
          method: 'PATCH',
          body: formData,
        }
      },
      async onQueryStarted(formData, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState
        const { orderBy, cardsCount, currentPage, itemsPerPage, authorId, searchByName } =
          state.deckSlice

        const id = formData.get('deckId') as string
        const isPrivate = formData.get('isPrivate') as string
        const cover = formData.get('cover') as File | null
        const name = formData.get('name') as string

        const patchResult = dispatch(
          decksApi.util.updateQueryData(
            'getDecks',
            {
              name: searchByName,
              itemsPerPage,
              currentPage,
              authorId,
              maxCardsCount: cardsCount[1],
              minCardsCount: cardsCount[0],
              orderBy: !orderBy ? null : `${orderBy?.key}-${orderBy?.direction}`,
            },
            draft => {
              const deckId = draft.items.findIndex(deck => deck.id === id)

              draft.items[deckId].name = name
              if (cover) {
                draft.items[deckId].cover = URL.createObjectURL(cover)
              }
              draft.items[deckId].isPrivate = Boolean(isPrivate === 'true')
            }
          )
        )

        const patchResult2 = dispatch(
          decksApi.util.updateQueryData('getDeckById', id, draft => {
            draft.name = name
            if (cover) {
              draft.cover = URL.createObjectURL(cover)
            }
          })
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
          patchResult2.undo()
        }
      },
      invalidatesTags: ['Decks'],
    }),
    getLearn: builder.query<Card, GetLearnArgs>({
      query: ({ id, ...params }) => ({
        url: `v1/decks/${id}/learn`,
        method: 'GET',
        params,
      }),
    }),
    saveGrade: builder.mutation<void, SaveGradeArgs>({
      query: ({ deckId: id, ...body }) => ({
        url: `v1/decks/${id}/learn`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cards'],
    }),
  }),
})

export const {
  useGetDecksQuery,
  useGetDeckByIdQuery,
  useCreateDeckMutation,
  useDeleteDeckMutation,
  useUpdateDeckMutation,
  useGetLearnQuery,
  useSaveGradeMutation,
} = decksApi
