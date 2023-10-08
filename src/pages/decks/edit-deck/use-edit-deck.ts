import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createDeckSchema = z.object({
  name: z.string().optional(),
  isPrivate: z.boolean().optional(),
})

export type FormValues = z.infer<typeof createDeckSchema>

export const useEditDeck = (name: string, isPrivate: boolean) => {
  const { handleSubmit, control } = useForm<FormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      name,
      isPrivate,
    },
  })

  return { handleSubmit, control }
}
