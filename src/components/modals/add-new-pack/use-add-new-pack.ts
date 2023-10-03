import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createDeckSchema = z.object({
  deckName: z.string().nonempty('Enter pack name'),
  isPrivate: z.boolean().optional(),
})

export type FormValues = z.infer<typeof createDeckSchema>

export const useAddNewPack = () => {
  const { handleSubmit, control } = useForm<FormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      deckName: '',
      isPrivate: false,
    },
  })

  return { handleSubmit, control }
}
