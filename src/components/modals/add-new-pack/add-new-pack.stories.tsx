import { useState } from 'react'

import type { Meta } from '@storybook/react'

import { AddNewPack, FormValues } from 'components/modals/add-new-pack'

const meta = {
  title: 'Components/MODALS/AddNewPack',
  component: AddNewPack,
  tags: ['autodocs'],
} satisfies Meta<typeof AddNewPack>

export default meta

const AddPackWithHooks = () => {
  const [open, setOpen] = useState<boolean>(false)

  const handleSubmit = (data: FormValues) => console.log(data)

  return <AddNewPack open={open} onClose={() => setOpen(state => !state)} onSubmit={handleSubmit} />
}

export const Default = {
  render: () => <AddPackWithHooks />,
}
