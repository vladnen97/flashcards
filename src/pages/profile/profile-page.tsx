import { useState } from 'react'

import { useLogoutMutation, useMeQuery, useUpdateProfileMutation } from '@/services/auth'
import { Profile } from 'components/auth/profile'
import { ProfileSchemaType } from 'components/auth/profile/use-profile-form.ts'

export const ProfilePage = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const { data, isLoading } = useMeQuery()
  const [logout] = useLogoutMutation()
  const [updateProfile] = useUpdateProfileMutation()

  const handleUpdateProfile = (data: ProfileSchemaType) => {
    updateProfile({ name: data.nickName })
      .unwrap()
      .then(() => {
        setIsEdit(false)
      })
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <Profile
      isEdit={isEdit}
      setIsEdit={setIsEdit}
      name={data?.name || ''}
      email={data?.email || ''}
      src={data?.avatar}
      onSubmit={handleUpdateProfile}
      onSignOut={logout}
    />
  )
}
