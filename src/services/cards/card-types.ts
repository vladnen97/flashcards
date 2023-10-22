import { PaginatedEntity, Pagination } from '@/services/types.ts'

export type GetCardsArgs = {
  id: string
  question?: string
  orderBy?: string | null
  currentPage?: Pagination['currentPage']
  itemsPerPage?: Pagination['itemsPerPage']
}
export type CreateCardArgs = {
  id: string
  question: string
  answer: string
  questionImg?: File | null
  answerImg?: File | null
}
export type DeleteCardArgs = {
  id: string
  deckId: string
}
export type UpdateCardArgs = CreateCardArgs & {
  deckId: string
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
