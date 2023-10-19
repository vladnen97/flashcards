import { FC } from 'react'

import s from '../avatar/avatar.module.scss'

type Props = {
  src?: string | null
  name?: string
  size?: number
}

export const Avatar: FC<Props> = ({ src, name, size = 36 }) => {
  return (
    <img
      src={
        src ||
        'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'
      }
      alt={`${name}-src`}
      className={s.avatar}
      width={size}
      height={size}
    />
  )
}
