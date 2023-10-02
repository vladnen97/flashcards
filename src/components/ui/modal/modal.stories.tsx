import { useState } from 'react'

import type { Meta } from '@storybook/react'

import Button from '../button/button'

import { Modal } from './'

import { Checkbox } from 'components/ui/checkbox'
import { TextField } from 'components/ui/text-field'

const meta = {
  title: 'Components/UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    trigger: {},
    title: {},
    children: {},
  },
} satisfies Meta<typeof Modal>

export default meta

const ModalWithHooks = (props: { title?: string }) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Modal
      open={open}
      trigger={<Button>Add New Pack</Button>}
      onClose={() => setOpen(state => !state)}
      title={props.title}
    >
      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
        <TextField label="Name Pask" />
        <Checkbox label="Private pack" />
        <Button>Add Pack</Button>
      </div>
    </Modal>
  )
}

export const Default = {
  render: () => <ModalWithHooks title={'Add New Pack'} />,
}

export const WithoutTitle = {
  render: () => <ModalWithHooks />,
}
