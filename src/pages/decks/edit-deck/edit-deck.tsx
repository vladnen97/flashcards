import { ReactNode, useState } from 'react'

import s from '@/pages/decks/add-new-pack/add-new-pack.module.scss'
import { useEditDeck, FormValues } from '@/pages/decks/edit-deck/index.ts'
import { useUpdateDeckMutation } from '@/services/decks'
import Button from 'components/ui/button/button.tsx'
import { ControlledCheckbox, ControlledTextField } from 'components/ui/controlled'
import { Modal } from 'components/ui/modal'

type Props = {
  deckId: string
  deckName: string
  isPrivateDeck: boolean
  trigger: ReactNode
}

export const EditDeck = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const { handleSubmit, control } = useEditDeck(props.deckName, props.isPrivateDeck)
  const [updateDeck] = useUpdateDeckMutation()

  const handleUpdateDeckSubmit = (data: FormValues) => {
    updateDeck({ ...data, id: props.deckId })
      .unwrap()
      .then(() => {
        setOpen(false)
      })
  }

  return (
    <Modal
      trigger={props.trigger}
      title={'Edit Pack'}
      open={open}
      onClose={() => setOpen(state => !state)}
    >
      <form onSubmit={handleSubmit(handleUpdateDeckSubmit)} className={s.content}>
        <ControlledTextField name={'name'} control={control} label={'Name Deck'} />
        <ControlledCheckbox name={'isPrivate'} control={control} label={'Private deck'} />
        <div className={s.btnGroup}>
          <Button onClick={() => setOpen(false)} type={'button'} variant={'secondary'}>
            Cancel
          </Button>
          <Button type={'submit'}>Save Changes</Button>
        </div>
      </form>
    </Modal>
  )
}
