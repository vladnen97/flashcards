import { PaginatedEntity, Pagination } from '@/services/types.ts'

export type GetDecksArgs = {
  minCardsCount?: number
  maxCardsCount?: number
  name?: string
  authorId?: DeckAuthor['id']
  orderBy?: string | null
  currentPage?: Pagination['currentPage']
  itemsPerPage?: Pagination['itemsPerPage']
}
export type CreateDeckArgs = {
  cover?: string
  name: string
  isPrivate?: boolean
}
export type UpdateDeckArgs = Partial<CreateDeckArgs> & { id: string }
export type GetLearnArgs = {
  id: string
  previousCardId?: string
}
export type SaveGradeArgs = {
  deckId: string
  cardId: string
  grade: 0 | 1 | 2 | 3 | 4 | 5
}

export type DecksResponse = PaginatedEntity<DeckWithAuthor> & {
  maxCardsCount: number
}
export type DeckAuthor = {
  id: string
  name: string
}
export type DeckWithAuthor = Deck & {
  author: DeckAuthor
}
export type Deck = {
  id: string
  userId: DeckAuthor['id']
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
}
