import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'

import { Cards } from '@/pages/cards'
import { Decks } from '@/pages/decks'
import { Learn } from '@/pages/learn'
import { ProfilePage } from '@/pages/profile'
import { RecoverPasswordPage } from '@/pages/recover-password'
import { ResetPassword } from '@/pages/reset-password'
import { SignInPage } from '@/pages/sign-in'
import { SignUpPage } from '@/pages/sign-up-page'
import { useMeQuery } from '@/services/auth/auth-api.ts'
import { Layout } from 'components/layout'

const publicRoutes: RouteObject[] = [
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/recover-password',
    element: <RecoverPasswordPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPassword />,
  },
]

const privateRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Decks />,
  },
  {
    path: '/cards/:id',
    element: <Cards />,
  },
  {
    path: '/learn/:id',
    element: <Learn />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
]

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <PrivateRoutes />,
        children: privateRoutes,
      },
      ...publicRoutes,
    ],
  },
])

export const Router = () => {
  return <RouterProvider router={router} />
}

function PrivateRoutes() {
  const { data, isLoading } = useMeQuery()

  if (isLoading) return <div>Loading...</div>

  const isAuthenticated = !!data

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />
}
