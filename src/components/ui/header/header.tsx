import { FC } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { Logo, LogOutOutline, PersonOutline } from 'assets/icons'
import { Avatar } from 'components/ui/avatar'
import Button from 'components/ui/button/button.tsx'
import { Dropdown, DropdownItem, DropdownItemWithIcon } from 'components/ui/dropdown'
import { Typography } from 'components/ui/typography'

// eslint-disable-next-line
import s from './header.module.scss'

export type HeaderProps = {
  userData: {
    avatar: string
    email: string
    name: string
  } | null
  onSignOut?: () => void
}

export const Header: FC<HeaderProps> = ({ userData, onSignOut }) => {
  const navigate = useNavigate()

  return (
    <header className={s.header}>
      <Link to={'/'} className={s.logo}>
        <Logo />
      </Link>
      {!userData && <Button>Sign In</Button>}
      {userData && (
        <Dropdown
          trigger={
            <button className={s.userMenu}>
              <Typography as={'div'} variant={'subtitle1'} className={s.userName}>
                {userData.name}
              </Typography>
              <Avatar src={userData.avatar} name={userData.name} />
            </button>
          }
        >
          <DropdownItem disabled>
            <Avatar src={userData.avatar} name={userData.name} />
            <div>
              <Typography as={'div'} variant={'subtitle2'}>
                {userData.name}
              </Typography>
              <Typography as={'div'} variant={'caption'} className={s.email}>
                {userData.email}
              </Typography>
            </div>
          </DropdownItem>
          <DropdownItemWithIcon
            icon={<PersonOutline />}
            text={'My Profile'}
            onSelect={() => navigate('/profile')}
          />
          <DropdownItemWithIcon icon={<LogOutOutline />} text={'Sign Out'} onSelect={onSignOut} />
        </Dropdown>
      )}
    </header>
  )
}
