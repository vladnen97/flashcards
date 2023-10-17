import { Outlet } from 'react-router-dom'

import s from './layout.module.scss'

import { useLogoutMutation, useMeQuery } from '@/services/auth/auth-api.ts'
import { Header } from 'components/ui/header'

export const Layout = () => {
  const { data } = useMeQuery()
  const [logout] = useLogoutMutation()

  let userData = null

  if (data) {
    userData = { name: '', email: '', avatar: null as string | null }
    userData.name = data.name
    userData.email = data.email
    userData.avatar = data.avatar
  }

  return (
    <>
      <Header userData={userData} onSignOut={logout} />
      <main className={s.container}>
        <Outlet />
      </main>
    </>
  )
}
