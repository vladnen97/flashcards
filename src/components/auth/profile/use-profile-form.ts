import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

const ProfileSchema = z.object({
  nickName: z.string().trim().nonempty('Enter your name').min(3),
})

export type ProfileSchemaType = z.infer<typeof ProfileSchema>

export const useProfileForm = ({ name }: { name: string }) => {
  const { handleSubmit, control } = useForm<ProfileSchemaType>({
    resolver: zodResolver(ProfileSchema),
    mode: 'onSubmit',
    defaultValues: {
      nickName: name,
    },
  })

  return { handleSubmit, control }
}
