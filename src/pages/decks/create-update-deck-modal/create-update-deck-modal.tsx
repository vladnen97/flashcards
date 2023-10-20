import { ReactNode } from 'react'

import s from './create-update-deck.module.scss'
import { FormValues, useCreateUpdateDeck } from './use-create-update-deck.ts'

import Button from 'components/ui/button/button.tsx'
import { ControlledCheckbox, ControlledTextField } from 'components/ui/controlled'
import { Modal } from 'components/ui/modal'

type Props = {
  openModal?: boolean
  setOpenModal?: (value: boolean) => void
  deckId?: string
  deckName?: string
  isPrivateDeck?: boolean
  isUpdate?: boolean
  trigger?: ReactNode
}

export const CreateUpdateDeckModal = ({
  openModal,
  setOpenModal,
  isUpdate = false,
  trigger,
  isPrivateDeck,
  deckId,
  deckName,
}: Props) => {
  const { open, setOpen, handleSubmit, control, updateDeck, createDeck } = useCreateUpdateDeck({
    deckName,
    isPrivateDeck,
  })

  const handleDeckSubmit = (data: FormValues) => {
    if (isUpdate) {
      updateDeck({ ...data, id: deckId || '' })
    } else {
      createDeck(data)
    }

    if (setOpenModal) {
      setOpenModal(false)
    } else {
      setOpen(false)
    }
  }

  return (
    <Modal
      trigger={trigger}
      title={isUpdate ? 'Edit Deck' : 'Add New Deck'}
      open={openModal ? openModal : open}
      onClose={setOpenModal ? setOpenModal : setOpen}
    >
      <form onSubmit={handleSubmit(handleDeckSubmit)} className={s.content}>
        <ControlledTextField name={'name'} control={control} label={'Name Deck'} />
        <ControlledCheckbox name={'isPrivate'} control={control} label={'Private deck'} />
        <div className={s.btnGroup}>
          <Button onClick={() => setOpen(false)} type={'button'} variant={'secondary'}>
            Cancel
          </Button>
          <Button type={'submit'}>{isUpdate ? 'Save Changes' : 'Add New Deck'}</Button>
        </div>
      </form>
    </Modal>
  )
}
