import { useState } from 'react'

import { useRecoverPasswordMutation } from '@/services/auth'
import { CheckEmail } from 'components/auth/check-email'
import { RecoverPassword } from 'components/auth/recover-password'

export const RecoverPasswordPage = () => {
  const [show, setShow] = useState<string>('')
  const [recoverPassword] = useRecoverPasswordMutation()
  const handleRecoverPass = (data: { email: string }) => {
    const html: string =
      '<h1>Hi, ##name##</h1><p>Click <a href="https://flashcards-lake.vercel.app/reset-password/##token##">here</a> to recover your password</p>'

    recoverPassword({ html, ...data })
      .unwrap()
      .then(() => {
        setShow(data.email)
      })
  }

  return show ? <CheckEmail email={show} /> : <RecoverPassword onSubmit={handleRecoverPass} />
}
