import { Outlet } from 'react-router-dom'

import s from './layout.module.scss'

import { Header } from 'components/ui/header'

export const Layout = () => {
  return (
    <>
      <Header userData={null} onSignOut={() => {}} />
      <main className={s.container}>
        <Outlet />
      </main>
    </>
  )
}
