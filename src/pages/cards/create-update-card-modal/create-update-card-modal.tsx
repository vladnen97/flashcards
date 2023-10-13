import { ReactNode } from 'react'

import { useCreateUpdateCard } from './use-create-update-card.ts'

import Button from 'components/ui/button/button.tsx'
import { ControlledTextField } from 'components/ui/controlled'
import { Modal } from 'components/ui/modal'

// eslint-disable-next-line
import s from './create-update-card.module.scss'

type Props = {
  deckId: string
  cardId?: string
  cardQuestion?: string
  cardAnswer?: string
  isUpdate?: boolean
  trigger: ReactNode
}
export const CreateUpdateCardModal = ({
  cardId,
  cardAnswer,
  cardQuestion,
  isUpdate = false,
  trigger,
  deckId,
}: Props) => {
  const { open, setOpen, handleSubmit, control, handleCardSubmit } = useCreateUpdateCard({
    cardId,
    cardAnswer,
    cardQuestion,
    deckId,
    isUpdate,
  })

  return (
    <Modal
      open={open}
      onClose={() => setOpen(state => !state)}
      trigger={trigger}
      title={isUpdate ? 'Edit Card' : 'Add New Card'}
    >
      <form onSubmit={handleSubmit(handleCardSubmit)} className={s.content}>
        <ControlledTextField name={'question'} control={control} label={'Question'} />
        <ControlledTextField name={'answer'} control={control} label={'Answer'} />
        <div className={s.btnGroup}>
          <Button type={'button'} onClick={() => setOpen(false)} variant={'secondary'}>
            Cancel
          </Button>
          <Button type={'submit'}>{isUpdate ? 'Save Changes' : 'Add New Card'}</Button>
        </div>
      </form>
    </Modal>
  )
}
