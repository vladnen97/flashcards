import { PaginatedEntity, Pagination } from '@/services/types.ts'

export type GetCardsArgs = {
  id: string
  question?: string
  orderBy?: string | null
  currentPage?: Pagination['currentPage']
  itemsPerPage?: Pagination['itemsPerPage']
}
export type CardRequestArgs = {
  id: string
  question: string
  answer: string
  questionImg?: string
  answerImg?: string
  questionVideo?: string
  answerVideo?: string
}

export type CardsResponse = PaginatedEntity<Card>

export type Card = {
  id: string
  question: string
  answer: string
  deckId: string
  questionImg: string | null
  answerImg: string | null
  questionVideo: string | null
  answerVideo: string | null
  created: string
  updated: string
  shots: number
  grade: number
  userId: string
}
