import type { Meta, StoryObj } from '@storybook/react'

import Button from '../button/button'

import { Modal } from './'

import { EditOutline, TrashOutline } from 'assets/icons'
import { Checkbox } from 'components/ui/checkbox'
import { TextField } from 'components/ui/text-field'
import { Typography } from 'components/ui/typography'

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
type Story = StoryObj<typeof meta>

export const AddNewPack: Story = {
  args: {
    trigger: <Button>Add New Pack</Button>,
    title: 'Add New Pack',
    children: (
      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
        <TextField label="Name Pask" />
        <Checkbox label="Private pack" />
        <Button>Add Pack</Button>
      </div>
    ),
  },
}

export const EditPack: Story = {
  args: {
    trigger: <EditOutline />,
    title: 'Edit Pack',
    children: (
      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
        <TextField label="Name Pask" />
        <Checkbox label="Private pack" />
        <Button>Save Changes</Button>
      </div>
    ),
  },
}

export const DeletePack: Story = {
  args: {
    trigger: <TrashOutline />,
    title: 'Delete Pack',
    children: (
      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
        <Typography style={{ whiteSpace: 'pre-line' }}>
          Do you really want to remove Pack Name?
          {'\n'}
          All cards will be deleted.
        </Typography>
        <Button>Delete Pack</Button>
      </div>
    ),
  },
}
