import { ReactNode } from 'react'

import s from './add-new-pack.module.scss'
import { useAddNewPack } from './use-add-new-pack.ts'

import Button from 'components/ui/button/button.tsx'
import { ControlledCheckbox, ControlledTextField } from 'components/ui/controlled'
import { Modal } from 'components/ui/modal'

type Props = {
  trigger: ReactNode
}

export const AddNewPack = (props: Props) => {
  const { open, setOpen, handleSubmit, control, handleCreateDeckSubmit } = useAddNewPack()

  return (
    <Modal
      trigger={props.trigger}
      title={'Add New Deck'}
      open={open}
      onClose={() => setOpen(state => !state)}
    >
      <form onSubmit={handleSubmit(handleCreateDeckSubmit)} className={s.content}>
        <ControlledTextField name={'name'} control={control} label={'Name Deck'} />
        <ControlledCheckbox name={'isPrivate'} control={control} label={'Private deck'} />
        <div className={s.btnGroup}>
          <Button onClick={() => setOpen(false)} type={'button'} variant={'secondary'}>
            Cancel
          </Button>
          <Button type={'submit'}>Add New Deck</Button>
        </div>
      </form>
    </Modal>
  )
}
