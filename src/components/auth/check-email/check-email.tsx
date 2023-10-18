import { FC } from 'react'

import s from './check-email.module.scss'

import CheskEmail from 'assets/icons/chesk-email.tsx'
import { Card } from 'components/ui/card'
import { Typography } from 'components/ui/typography'

type CheckEmailProps = { email: string }

export const CheckEmail: FC<CheckEmailProps> = ({ email }) => {
  return (
    <Card className={s.card}>
      <Typography variant="large" as="h1" className={s.title}>
        Check Email
      </Typography>
      <CheskEmail className={s.emailImage} />
      <Typography variant="body2" className={s.description}>
        {`We’ve sent an Email with instructions to ${email}`}
        <br />
        Now this page can be closed.
      </Typography>
      {/*<Button as={Link} to={'/sign-in'} fullWidth>*/}
      {/*  <Typography variant="body2">Back to Sign in</Typography>*/}
      {/*</Button>*/}
    </Card>
  )
}
