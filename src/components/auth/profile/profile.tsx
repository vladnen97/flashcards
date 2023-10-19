import { FC } from 'react'

import s from './profile.module.scss'

import { EditOutline, LogOutOutline } from 'assets/icons'
import { ProfileSchemaType, useProfileForm } from 'components/auth/profile/use-profile-form.ts'
import Button from 'components/ui/button/button.tsx'
import { Card } from 'components/ui/card'
import { ControlledTextField } from 'components/ui/controlled'
import { Typography } from 'components/ui/typography'

type ProfileProps = {
  isEdit: boolean
  setIsEdit: (value: boolean) => void
  name: string
  email: string
  src?: string | null
  onSignOut?: () => void
  onSubmit: (data: ProfileSchemaType) => void
}

export const Profile: FC<ProfileProps> = ({
  name,
  email,
  isEdit,
  setIsEdit,
  onSignOut,
  onSubmit,
}) => {
  const { handleSubmit, control } = useProfileForm({ name })

  return (
    <Card className={s.card}>
      <Typography variant="large" className={s.title}>
        Personal Information
      </Typography>
      {/*<div className={s.imgBlock}>*/}
      {/*  <Avatar src={src} name="user" size={96} />*/}
      {/*  <label>*/}
      {/*    <input type="file" accept="image/*" style={{ display: 'none' }} />*/}
      {/*    <Button variant="secondary" as={'span'} className={s.img}>*/}
      {/*      <EditOutline />*/}
      {/*    </Button>*/}
      {/*  </label>*/}
      {/*</div>*/}
      {!isEdit ? (
        <>
          <Typography variant="h1" className={s.name}>
            {name} <EditOutline onClick={() => setIsEdit(true)} />
          </Typography>
          <Typography variant="body2" className={s.email}>
            {email}
          </Typography>
          <Button variant="secondary" onClick={onSignOut} className={s.logoutBtn}>
            <LogOutOutline /> <Typography>Logout</Typography>
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
          <ControlledTextField label="Nickname" name="nickName" control={control} />
          <Button className={s.submitBtn} fullWidth type={'submit'}>
            Save Changes
          </Button>
        </form>
      )}
    </Card>
  )
}
