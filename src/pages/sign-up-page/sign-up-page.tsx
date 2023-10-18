import { useNavigate } from 'react-router-dom'

import { useSignUpMutation } from '@/services/auth'
import { FormValues, SignUp } from 'components/auth/sign-up'

export const SignUpPage = () => {
  const [signUp] = useSignUpMutation()
  const navigate = useNavigate()
  const handleSignUp = (data: Omit<FormValues, 'confirmPassword'>) => {
    signUp(data)
      .unwrap()
      .then(() => {
        navigate('/sign-in')
      })
  }

  return <SignUp onSubmit={handleSignUp} />
}
