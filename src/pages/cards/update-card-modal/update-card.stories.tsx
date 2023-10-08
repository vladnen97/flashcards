import { Meta, StoryObj } from '@storybook/react'

import { UpdateCard } from './update-card.tsx'

import { EditOutline } from 'assets/icons'

const meta = {
  title: 'Components/MODALS/UpdateCard',
  component: UpdateCard,
  tags: ['autodocs'],
} satisfies Meta<typeof UpdateCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <EditOutline />,
    cardId: 'abcdefg',
    cardQuestion: 'Hello',
    cardAnswer: 'Привет',
  },
}
