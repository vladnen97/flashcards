import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useCreateCardMutation, useUpdateCardMutation } from '@/services/cards'

const createCardSchema = z.object({
  question: z
    .string()
    .nonempty('Enter question')
    .min(3)
    .max(500, 'Question must contain at most 500 character(s)'),
  answer: z
    .string()
    .nonempty('Enter answer')
    .min(3)
    .max(500, 'Answer must contain at most 500 character(s)'),
})

type CreateCardFormValues = z.infer<typeof createCardSchema>
type UseCreateUpdateCardProps = {
  answerCover?: File | null
  questionCover?: File | null
  deckId: string
  cardId?: string
  cardQuestion?: string
  cardAnswer?: string
  isUpdate?: boolean
}

export const useCreateUpdateCard = ({
  answerCover,
  questionCover,
  cardId,
  cardQuestion,
  cardAnswer,
  isUpdate,
  deckId,
}: UseCreateUpdateCardProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const { handleSubmit, control } = useForm<CreateCardFormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      question: cardQuestion || '',
      answer: cardAnswer || '',
    },
  })

  const [createCard] = useCreateCardMutation()
  const [updateCard] = useUpdateCardMutation()

  const handleCardSubmit = (data: CreateCardFormValues) => {
    const formData = new FormData()

    questionCover && formData.append('questionImg', questionCover)
    answerCover && formData.append('answerImg', answerCover)
    formData.append('answer', data.answer)
    formData.append('question', data.question)
    isUpdate && formData.append('cardId', cardId || '')
    formData.append('deckId', deckId)

    if (isUpdate) {
      updateCard({ ...data, deckId, id: cardId || '' })
    } else {
      createCard({ ...data, id: deckId, questionImg: questionCover, answerImg: answerCover })
    }

    setOpen(false)
  }

  return { open, setOpen, handleSubmit, control, handleCardSubmit }
}
