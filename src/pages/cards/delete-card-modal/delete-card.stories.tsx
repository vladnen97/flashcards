import { Meta, StoryObj } from '@storybook/react'

import { DeleteCard } from '@/pages/cards/delete-card-modal/delete-card.tsx'
import TrashOutline from 'assets/icons/trash-outline.tsx'

const meta = {
  title: 'Components/MODALS/DeleteCard',
  component: DeleteCard,
  tags: ['autodocs'],
} satisfies Meta<typeof DeleteCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <TrashOutline />,
    cardId: '123456',
    cardName: 'Best Card',
  },
}
