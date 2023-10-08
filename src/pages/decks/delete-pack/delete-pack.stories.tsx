import type { Meta } from '@storybook/react'

import { DeleteDeck } from '@/pages/decks/delete-pack/index.ts'
import { TrashOutline } from 'assets/icons'
import Button from 'components/ui/button/button.tsx'

const meta = {
  title: 'Components/MODALS/DeletePack',
  component: DeleteDeck,
  tags: ['autodocs'],
} satisfies Meta<typeof DeleteDeck>

export default meta

const DeleteDeckWithHooks = () => {
  return (
    <DeleteDeck
      deckName={'Dark'}
      deckId={'123456'}
      trigger={
        <Button>
          <TrashOutline /> Delete
        </Button>
      }
    />
  )
}

export const Default = {
  render: () => <DeleteDeckWithHooks />,
}
