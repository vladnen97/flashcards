import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useCreateDeckMutation, useUpdateDeckMutation } from '@/services/decks'

const createDeckSchema = z.object({
  name: z.string().nonempty('Enter deck name').min(3).max(30),
  isPrivate: z.boolean(),
})

export type FormValues = z.infer<typeof createDeckSchema>
type UseAddNewPackProps = {
  deckName?: string
  isPrivateDeck?: boolean
}

export const useCreateUpdateDeck = ({ isPrivateDeck, deckName }: UseAddNewPackProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [createDeck] = useCreateDeckMutation()
  const [updateDeck] = useUpdateDeckMutation()
  const { handleSubmit, control } = useForm<FormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      name: deckName || '',
      isPrivate: isPrivateDeck || false,
    },
  })

  return { open, setOpen, handleSubmit, control, updateDeck, createDeck }
}
