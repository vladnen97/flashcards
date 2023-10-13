import { ReactNode, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { useDeleteDeckMutation } from '@/services/decks'
import Button from 'components/ui/button/button.tsx'
import { Modal } from 'components/ui/modal'
import { Typography } from 'components/ui/typography'

// eslint-disable-next-line
import s from './delete-pack.module.scss'

type Props = {
  deckId: string
  deckName: string
  trigger: ReactNode
}
export const DeleteDeckModal = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const [deleteDeck] = useDeleteDeckMutation()

  const handleDeleteDeckSubmit = () => {
    deleteDeck(props.deckId)
      .unwrap()
      .then(() => {
        setOpen(false)
        navigate('/')
      })
  }

  return (
    <Modal
      trigger={props.trigger}
      title={'Delete Pack'}
      open={open}
      onClose={() => setOpen(state => !state)}
    >
      <Typography variant={'subtitle1'} className={s.content}>
        Do you really want to remove {props.deckName}? <br />
        All cards will be deleted.
      </Typography>
      <div className={s.btnGroup}>
        <Button onClick={() => setOpen(false)} variant={'secondary'}>
          Cancel
        </Button>
        <Button onClick={handleDeleteDeckSubmit}>Delete Pack</Button>
      </div>
    </Modal>
  )
}
