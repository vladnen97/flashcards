import { useState } from 'react'

import type { Meta } from '@storybook/react'

import { FormValues } from 'components/modals/add-new-pack'
import { EditDeck } from 'components/modals/edit-deck'

const meta = {
  title: 'Components/MODALS/EditPack',
  component: EditDeck,
  tags: ['autodocs'],
} satisfies Meta<typeof EditDeck>

export default meta

const EditDeckWithHooks = () => {
  const [open, setOpen] = useState<boolean>(false)

  const handleSubmit = (data: FormValues) => console.log(data)

  return <EditDeck open={open} onClose={() => setOpen(state => !state)} onSubmit={handleSubmit} />
}

export const Default = {
  render: () => <EditDeckWithHooks />,
}