import { ReactNode } from 'react'

import { useUpdateCard } from './use-update-card.ts'

import Button from 'components/ui/button/button.tsx'
import { ControlledTextField } from 'components/ui/controlled'
import { Modal } from 'components/ui/modal'

// eslint-disable-next-line
import s from './update-card.module.scss'

type Props = {
  cardId: string
  cardQuestion: string
  cardAnswer: string
  trigger: ReactNode
}
export const UpdateCard = (props: Props) => {
  const { open, setOpen, handleSubmit, control, handleUpdateCard } = useUpdateCard(
    props.cardId,
    props.cardQuestion,
    props.cardAnswer
  )

  return (
    <Modal
      open={open}
      onClose={() => setOpen(state => !state)}
      trigger={props.trigger}
      title={'Edit Card'}
    >
      <form onSubmit={handleSubmit(handleUpdateCard)} className={s.content}>
        <ControlledTextField name={'question'} control={control} label={'Question'} />
        <ControlledTextField name={'answer'} control={control} label={'Answer'} />
        <div className={s.btnGroup}>
          <Button type={'button'} onClick={() => setOpen(false)} variant={'secondary'}>
            Cancel
          </Button>
          <Button type={'submit'}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  )
}
