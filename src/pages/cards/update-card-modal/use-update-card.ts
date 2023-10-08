import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useUpdateCardMutation } from '@/services/cards'

const updateCardSchema = z.object({
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

type UpdateCardFormValues = z.infer<typeof updateCardSchema>

export const useUpdateCard = (cardId: string, cardQuestion: string, cardAnswer: string) => {
  const [open, setOpen] = useState<boolean>(false)
  const { handleSubmit, control } = useForm<UpdateCardFormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(updateCardSchema),
    defaultValues: {
      question: cardQuestion,
      answer: cardAnswer,
    },
  })

  const [updateCard] = useUpdateCardMutation()

  const handleUpdateCard = (data: UpdateCardFormValues) => {
    updateCard({ id: cardId, ...data })
      .unwrap()
      .then(() => setOpen(false))
  }

  return { open, setOpen, handleSubmit, control, handleUpdateCard }
}
