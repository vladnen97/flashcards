import { baseApi } from '../base-api.ts'

import { Card } from '@/services/cards/card-types.ts'
import {
  CreateDeckArgs,
  Deck,
  DecksResponse,
  DeckWithAuthor,
  GetDecksArgs,
  GetLearnArgs,
  SaveGradeArgs,
  UpdateDeckArgs,
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
    createDeck: builder.mutation<DeckWithAuthor, CreateDeckArgs>({
      query: body => {
        const formData = new FormData()

        body.cover && formData.append('cover', body.cover)
        formData.append('name', body.name)
        formData.append('isPrivate', JSON.stringify(body.isPrivate))

        return {
          url: 'v1/decks',
          method: 'POST',
          body: formData,
        }
      },
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
                if (draft.items.length < itemsPerPage) {
                  draft.items.pop()
                }
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
    updateDeck: builder.mutation<DeckWithAuthor, UpdateDeckArgs>({
      query: ({ id, ...data }) => {
        const formData = new FormData()

        data.cover && formData.append('cover', data.cover)
        formData.append('name', data.name)
        formData.append('isPrivate', JSON.stringify(data.isPrivate))

        return {
          url: `v1/decks/${id}`,
          method: 'PATCH',
          body: formData,
        }
      },
      async onQueryStarted({ id, ...patch }, { dispatch, getState, queryFulfilled }) {
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
              const deckId = draft.items.findIndex(deck => deck.id === id)

              draft.items[deckId].name = patch.name
              draft.items[deckId].isPrivate = patch.isPrivate
              if (patch.cover) {
                draft.items[deckId].cover = URL.createObjectURL(patch.cover)
              }
            }
          )
        )

        const patchResult2 = dispatch(
          decksApi.util.updateQueryData('getDeckById', id, draft => {
            draft.name = patch.name
            if (patch.cover) {
              draft.cover = URL.createObjectURL(patch.cover)
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
    saveGrade: builder.mutation<Card, SaveGradeArgs>({
      query: ({ deckId: id, ...body }) => ({
        url: `v1/decks/${id}/learn`,
        method: 'POST',
        body,
      }),
      async onQueryStarted({ deckId }, { dispatch, queryFulfilled }) {
        try {
          const res = await queryFulfilled

          dispatch(
            decksApi.util.updateQueryData('getLearn', { id: deckId }, () => {
              return { ...res.data }
            })
          )
        } catch {}
      },
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
