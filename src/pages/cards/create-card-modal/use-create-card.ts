import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useCreateCardMutation } from '@/services/cards'

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

export const useCreateCard = (deckId: string) => {
  const [open, setOpen] = useState<boolean>(false)
  const { handleSubmit, control } = useForm<CreateCardFormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(createCardSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  })

  const [createCard] = useCreateCardMutation()

  const handleCreateCard = (data: CreateCardFormValues) => {
    createCard({ id: deckId, ...data })
      .unwrap()
      .then(() => setOpen(false))
  }

  return { open, setOpen, handleSubmit, control, handleCreateCard }
}
