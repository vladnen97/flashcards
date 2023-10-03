import { useState } from 'react'

import type { Meta } from '@storybook/react'

import { DeletePack } from 'components/modals/delete-pack'

const meta = {
  title: 'Components/MODALS/DeletePack',
  component: DeletePack,
  tags: ['autodocs'],
} satisfies Meta<typeof DeletePack>

export default meta

const DeleteDeckWithHooks = () => {
  const [open, setOpen] = useState<boolean>(false)

  const handleDelete = () => console.log('Deck deleted')

  return <DeletePack open={open} onClose={() => setOpen(state => !state)} onDelete={handleDelete} />
}

export const Default = {
  render: () => <DeleteDeckWithHooks />,
}
