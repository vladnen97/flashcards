import { useState } from 'react'

import type { Meta } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { Profile } from './'

const meta = {
  title: 'Components/Auth/Profile',
  component: Profile,
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Profile>

export default meta

export const Default = () => {
  const img =
    'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'

  const [showTextField, setShowTextField] = useState<boolean>(false)

  return (
    <Profile
      name={'Sergey'}
      email={'sergey.ose.pyatigorsk@gmail.com'}
      src={img}
      isEdit={showTextField}
      setIsEdit={setShowTextField}
      onSignOut={() => {}}
    />
  )
}
