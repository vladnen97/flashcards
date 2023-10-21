import { ChangeEvent, FC, useState } from 'react'

import s from './profile.module.scss'

import { useUpdateProfileMutation } from '@/services/auth'
import { EditOutline, LogOutOutline } from 'assets/icons'
import { ProfileSchemaType, useProfileForm } from 'components/auth/profile/use-profile-form.ts'
import { Avatar } from 'components/ui/avatar'
import Button from 'components/ui/button/button.tsx'
import { Card } from 'components/ui/card'
import { ControlledTextField } from 'components/ui/controlled'
import { Typography } from 'components/ui/typography'

type ProfileProps = {
  isEdit: boolean
  setIsEdit: (value: boolean) => void
  name: string
  email: string
  src: string | null
  onSignOut?: () => void
}

export const Profile: FC<ProfileProps> = ({ src, name, email, isEdit, setIsEdit, onSignOut }) => {
  const [updateProfile] = useUpdateProfileMutation()
  const { handleSubmit, control } = useProfileForm({ name })

  const [file, setFile] = useState<File | null>(null)

  // eslint-disable-next-line no-nested-ternary
  const whatToShow = file ? URL.createObjectURL(file) : src ? src : null

  const handleSetFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0])
  }

  const onSubmit = (data: ProfileSchemaType) => {
    const formData = new FormData()

    formData.append('name', data.nickName)
    file && formData.append('avatar', file)

    updateProfile(formData)
      .unwrap()
      .then(() => {
        setIsEdit(false)
      })
  }

  return (
    <Card className={s.card}>
      <Typography variant="large" className={s.title}>
        Personal Information
      </Typography>
      {!isEdit ? (
        <>
          <Avatar src={src} name="user" size={96} />
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
        <>
          <div className={s.imgBlock}>
            <Avatar src={whatToShow} name="avatar" size={96} />
            <label htmlFor={'avatar'}>
              <input
                type="file"
                accept={'image/*'}
                onChange={handleSetFile}
                id={'avatar'}
                style={{ display: 'none' }}
              />
              <Button variant="secondary" as={'span'} className={s.img}>
                <EditOutline />
              </Button>
            </label>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
            <ControlledTextField label="Nickname" name="nickName" control={control} />
            <Button className={s.submitBtn} fullWidth type={'submit'}>
              Save Changes
            </Button>
          </form>
        </>
      )}
    </Card>
  )
}
