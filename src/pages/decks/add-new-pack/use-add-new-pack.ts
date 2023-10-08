import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const createDeckSchema = z.object({
  name: z.string().nonempty('Enter pack name').min(3).max(30),
  isPrivate: z.boolean().optional(),
})

export type FormValues = z.infer<typeof createDeckSchema>

export const useAddNewPack = () => {
  const { handleSubmit, control } = useForm<FormValues>({
    mode: 'onSubmit',
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      name: '',
      isPrivate: false,
    },
  })

  return { handleSubmit, control }
}
