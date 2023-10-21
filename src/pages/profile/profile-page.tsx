import { useState } from 'react'

import { useLogoutMutation, useMeQuery } from '@/services/auth'
import { Profile } from 'components/auth/profile'

export const ProfilePage = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const { data, isLoading } = useMeQuery()
  const [logout] = useLogoutMutation()

  if (isLoading) return <div>Loading...</div>

  return (
    <Profile
      isEdit={isEdit}
      setIsEdit={setIsEdit}
      name={data?.name || ''}
      email={data?.email || ''}
      src={data?.avatar || null}
      onSignOut={logout}
    />
  )
}
