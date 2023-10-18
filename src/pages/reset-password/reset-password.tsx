import { useNavigate, useParams } from 'react-router-dom'

import { useResetPasswordMutation } from '@/services/auth'
import { CreateNewPassword } from 'components/auth/create-new-password'

export const ResetPassword = () => {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()
  const [resetPassword] = useResetPasswordMutation()
  const handleResetPass = (data: { password: string }) => {
    resetPassword({ token: token || '', ...data })
      .unwrap()
      .then(() => {
        navigate('/sign-in')
      })
  }

  return <CreateNewPassword onSubmit={handleResetPass} />
}
