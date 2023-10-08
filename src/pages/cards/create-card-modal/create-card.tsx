import { ReactNode } from 'react'

import { useCreateCard } from './use-create-card.ts'

import Button from 'components/ui/button/button.tsx'
import { ControlledTextField } from 'components/ui/controlled'
import { Modal } from 'components/ui/modal'

// eslint-disable-next-line
import s from './create-card.module.scss'

type Props = {
  deckId: string
  trigger: ReactNode
}
export const CreateCard = (props: Props) => {
  const { open, setOpen, handleSubmit, control, handleCreateCard } = useCreateCard(props.deckId)

  return (
    <Modal
      open={open}
      onClose={() => setOpen(state => !state)}
      trigger={props.trigger}
      title={'Add New Card'}
    >
      <form onSubmit={handleSubmit(handleCreateCard)} className={s.content}>
        <ControlledTextField name={'question'} control={control} label={'Question'} />
        <ControlledTextField name={'answer'} control={control} label={'Answer'} />
        <div className={s.btnGroup}>
          <Button type={'button'} onClick={() => setOpen(false)} variant={'secondary'}>
            Cancel
          </Button>
          <Button type={'submit'}>Add New Card</Button>
        </div>
      </form>
    </Modal>
  )
}
