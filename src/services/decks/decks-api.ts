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
      query: data => ({
        url: 'v1/decks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Decks'],
    }),
    deleteDeck: builder.mutation<Deck, string>({
      query: id => ({
        url: `v1/decks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Decks'],
    }),
    updateDeck: builder.mutation<DeckWithAuthor, UpdateDeckArgs>({
      query: ({ id, ...body }) => ({
        url: `v1/decks/${id}`,
        method: 'PATCH',
        body,
      }),
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
