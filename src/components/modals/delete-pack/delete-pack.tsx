import Button from 'components/ui/button/button.tsx'
import { Modal } from 'components/ui/modal'
import { Typography } from 'components/ui/typography'

// eslint-disable-next-line
import s from './delete-pack.module.scss'

type Props = {
  open: boolean
  onClose: () => void
  onDelete: () => void
}
export const DeletePack = (props: Props) => {
  return (
    <Modal
      trigger={<Button>Delete</Button>}
      title={'Delete Pack'}
      open={props.open}
      onClose={props.onClose}
    >
      <Typography variant={'subtitle1'} className={s.content}>
        Do you really want to remove Pack Name? <br />
        All cards will be deleted.
      </Typography>
      <div className={s.btnGroup}>
        <Button onClick={props.onClose} variant={'secondary'}>
          Cancel
        </Button>
        <Button onClick={props.onDelete}>Delete Pack</Button>
      </div>
    </Modal>
  )
}
