import { Navigate, useNavigate } from 'react-router-dom'

import { useLoginMutation, useMeQuery } from '@/services/auth/auth-api.ts'
import { FormValues, SignIn } from 'components/auth/sign-in'

export const SignInPage = () => {
  const { data, isLoading } = useMeQuery()
  const [signIn, { isLoading: isSigningIn }] = useLoginMutation()
  const navigate = useNavigate()

  if (isLoading) return <div>Loading...</div>
  if (data) return <Navigate to={'/'} />

  const handleSignIn = (data: FormValues) => {
    signIn(data)
      .unwrap()
      .then(() => {
        navigate('/')
      })
  }

  return <SignIn onSubmit={handleSignIn} isSubmitting={isSigningIn} />
}
