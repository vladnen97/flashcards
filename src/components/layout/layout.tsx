import { Outlet } from 'react-router-dom'

import s from './layout.module.scss'

import { useLogoutMutation, useMeQuery } from '@/services/auth/auth-api.ts'
import { Header } from 'components/ui/header'

export const Layout = () => {
  const { data } = useMeQuery()
  const [logout] = useLogoutMutation()

  return (
    <>
      <Header userData={data} onSignOut={logout} />
      <main className={s.container}>
        <Outlet />
      </main>
    </>
  )
}
