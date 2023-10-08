import type { Meta } from '@storybook/react'

import { EditDeck } from '@/pages/decks/edit-deck/index.ts'
import { EditOutline } from 'assets/icons'
import Button from 'components/ui/button/button.tsx'

const meta = {
  title: 'Components/MODALS/EditPack',
  component: EditDeck,
  tags: ['autodocs'],
} satisfies Meta<typeof EditDeck>

export default meta

const EditDeckWithHooks = () => {
  return (
    <EditDeck
      deckId={'123'}
      deckName={'Dark'}
      isPrivateDeck={true}
      trigger={
        <Button>
          <EditOutline /> Edit
        </Button>
      }
    />
  )
}

export const Default = {
  render: () => <EditDeckWithHooks />,
}
