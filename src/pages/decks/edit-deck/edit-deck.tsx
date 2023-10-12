import { ReactNode } from 'react'

import s from '@/pages/decks/add-new-pack/add-new-pack.module.scss'
import { useEditDeck } from '@/pages/decks/edit-deck/index.ts'
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
  const { open, setOpen, handleSubmit, control, handleUpdateDeckSubmit } = useEditDeck(
    props.deckName,
    props.isPrivateDeck,
    props.deckId
  )

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
