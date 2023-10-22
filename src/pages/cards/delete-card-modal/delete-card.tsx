import { ReactNode, useState } from 'react'

import { useDeleteCardMutation } from '@/services/cards'
import Button from 'components/ui/button/button.tsx'
import { Modal } from 'components/ui/modal'
import { Typography } from 'components/ui/typography'

// eslint-disable-next-line
import s from './delete-card.module.scss'

type Props = {
  deckId: string
  cardId: string
  cardName: string
  trigger: ReactNode
}
export const DeleteCard = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const [deleteCard] = useDeleteCardMutation()

  const handleDelete = () => {
    deleteCard({ id: props.cardId, deckId: props.deckId })
      .unwrap()
      .then(() => setOpen(false))
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(state => !state)}
      trigger={props.trigger}
      title={'Delete Card'}
    >
      <Typography variant={'body1'} className={s.content}>
        Do you really want to remove {props.cardName}?
      </Typography>
      <div className={s.btnGroup}>
        <Button onClick={() => setOpen(false)} variant={'secondary'}>
          Cancel
        </Button>
        <Button onClick={handleDelete}>Delete Pack</Button>
      </div>
    </Modal>
  )
}
