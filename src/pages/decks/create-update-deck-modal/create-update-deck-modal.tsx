import { ChangeEvent, ReactNode, useState } from 'react'

import s from './create-update-deck.module.scss'
import { FormValues, useCreateUpdateDeck } from './use-create-update-deck.ts'

import { BlankCover, ImageOutline } from 'assets/icons'
import Button from 'components/ui/button/button.tsx'
import { ControlledCheckbox, ControlledTextField } from 'components/ui/controlled'
import { Modal } from 'components/ui/modal'

type Props = {
  cover?: string | null
  openModal?: boolean
  setOpenModal?: (value: boolean) => void
  deckId?: string
  deckName?: string
  isPrivateDeck?: boolean
  isUpdate?: boolean
  trigger?: ReactNode
}

export const CreateUpdateDeckModal = ({
  cover,
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

  const [file, setFile] = useState<File | null>(null)

  // eslint-disable-next-line no-nested-ternary
  const whatToShow = file ? URL.createObjectURL(file) : cover ? cover : undefined

  const handleSetFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files![0])
  }

  const handleDeckSubmit = (data: FormValues) => {
    if (isUpdate) {
      updateDeck({ ...data, cover: file, id: deckId || '' })
    } else {
      createDeck({ ...data, cover: file })
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
      <div className={s.coverModal}>
        {cover || file ? <img src={whatToShow} alt="cover" className={s.img} /> : <BlankCover />}
      </div>

      <label htmlFor={'cover'}>
        <input
          type="file"
          accept={'image/*'}
          onChange={handleSetFile}
          id={'cover'}
          style={{ display: 'none' }}
        />
        <Button variant="secondary" as={'span'} fullWidth className={s.filePicker}>
          <ImageOutline /> Change Cover
        </Button>
      </label>
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
