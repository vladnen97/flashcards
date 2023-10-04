import { useState } from 'react'

import type { Meta } from '@storybook/react'

import { TrashOutline } from 'assets/icons'
import { DeletePack } from 'components/modals/delete-pack'
import Button from 'components/ui/button/button.tsx'

const meta = {
  title: 'Components/MODALS/DeletePack',
  component: DeletePack,
  tags: ['autodocs'],
} satisfies Meta<typeof DeletePack>

export default meta

const DeleteDeckWithHooks = () => {
  const [open, setOpen] = useState<boolean>(false)

  const handleDelete = () => console.log('Deck deleted')

  return (
    <DeletePack
      open={open}
      onClose={() => setOpen(state => !state)}
      onDelete={handleDelete}
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
