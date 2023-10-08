import { Meta, StoryObj } from '@storybook/react'

import { CreateCard } from '@/pages/cards/create-card-modal/create-card.tsx'
import Button from 'components/ui/button/button.tsx'

const meta = {
  title: 'Components/MODALS/CreateCard',
  component: CreateCard,
  tags: ['autodocs'],
} satisfies Meta<typeof CreateCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Add New Card</Button>,
    deckId: '123456789',
  },
}
