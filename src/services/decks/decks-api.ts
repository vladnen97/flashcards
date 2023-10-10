import { baseApi } from '../base-api.ts'

import { Card } from '@/services/cards'

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
    getDeckById: builder.query<Omit<Deck, 'author'>, string>({
      query: id => ({
        url: `v1/decks/${id}`,
        method: 'GET',
      }),
      providesTags: ['Decks'],
    }),
    createDeck: builder.mutation<Deck, CreateDeckArgs>({
      query: data => ({
        url: 'v1/decks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Decks'],
    }),
    deleteDeck: builder.mutation<Omit<Deck, 'author'>, string>({
      query: id => ({
        url: `v1/decks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Decks'],
    }),
    updateDeck: builder.mutation<Deck, Partial<CreateDeckArgs> & { id: string }>({
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

type GetDecksArgs = {
  minCardsCount?: number
  maxCardsCount?: number
  name?: string
  authorId?: string
  orderBy?: string | null
  currentPage?: number
  itemsPerPage?: string
}
type CreateDeckArgs = {
  name: string
  isPrivate?: boolean
}
type GetLearnArgs = {
  id: string
  previousCardId?: string
}
type SaveGradeArgs = {
  deckId: string
  cardId: string
  grade: 0 | 1 | 2 | 3 | 4 | 5
}

export type DecksResponse = {
  maxCardsCount: number
  pagination: Pagination
  items: Deck[]
}
export type Pagination = {
  totalPages: number
  currentPage: number
  itemsPerPage: number
  totalItems: number
}
export type Author = {
  id: string
  name: string
}
export type Deck = {
  id: string
  userId: Author['id']
  name: string
  isPrivate: boolean
  shots: number
  cover: string | null
  rating: number
  isDeleted: boolean | null
  isBlocked: boolean | null
  created: string
  updated: string
  cardsCount: number
  author: Author
}
