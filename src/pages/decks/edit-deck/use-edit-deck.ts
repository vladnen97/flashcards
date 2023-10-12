import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useUpdateDeckMutation } from '@/services/decks'

const createDeckSchema = z.object({
  name: z.string().optional(),
  isPrivate: z.boolean().optional(),
})

export type FormValues = z.infer<typeof createDeckSchema>

export const useEditDeck = (name: string, isPrivate: boolean, deckId: string) => {
  const [open, setOpen] = useState<boolean>(false)
  const [updateDeck] = useUpdateDeckMutation()
  const { handleSubmit, control } = useForm<FormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      name,
      isPrivate,
    },
  })

  const handleUpdateDeckSubmit = (data: FormValues) => {
    updateDeck({ ...data, id: deckId })
      .unwrap()
      .then(() => {
        setOpen(false)
      })
  }

  return { open, setOpen, handleSubmit, control, handleUpdateDeckSubmit }
}
