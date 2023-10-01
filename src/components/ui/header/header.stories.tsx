import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { Header } from './'

const meta = {
  title: 'Components/UI/Header',
  component: Header,
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const LoggedOut: Story = {
  args: {
    userData: null,
  },
}

export const LoggedIn: Story = {
  args: {
    userData: {
      email: 'darkdescent1991@gmail.com',
      name: 'Vlad',
      avatar: 'https://placehold.co/200',
    },
  },
}
