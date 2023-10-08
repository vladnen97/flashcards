import { baseApi } from '../base-api.ts'

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
    createDeck: builder.mutation<Deck, createDeckBody>({
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
    updateDeck: builder.mutation<Deck, Partial<createDeckBody> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `v1/decks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Decks'],
    }),
  }),
})

export const {
  useGetDecksQuery,
  useGetDeckByIdQuery,
  useCreateDeckMutation,
  useDeleteDeckMutation,
  useUpdateDeckMutation,
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
type createDeckBody = {
  name: string
  isPrivate?: boolean
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
