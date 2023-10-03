import s from '../add-new-pack/add-new-pack.module.scss'

import { FormValues, useAddNewPack } from 'components/modals/add-new-pack'
import Button from 'components/ui/button/button.tsx'
import { ControlledCheckbox, ControlledTextField } from 'components/ui/controlled'
import { Modal } from 'components/ui/modal'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: FormValues) => void
}

export const EditDeck = (props: Props) => {
  const { handleSubmit, control } = useAddNewPack()

  return (
    <Modal
      trigger={<Button>Edit</Button>}
      title={'Edit Pack'}
      open={props.open}
      onClose={props.onClose}
    >
      <form onSubmit={handleSubmit(props.onSubmit)} className={s.content}>
        <ControlledTextField name={'deckName'} control={control} label={'Name Deck'} />
        <ControlledCheckbox name={'isPrivate'} control={control} label={'Private deck'} />
        <div className={s.btnGroup}>
          <Button onClick={props.onClose} type={'button'} variant={'secondary'}>
            Cancel
          </Button>
          <Button type={'submit'}>Add New Deck</Button>
        </div>
      </form>
    </Modal>
  )
}
