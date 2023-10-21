import { ChangeEvent, ReactNode, useState } from 'react'

import { useCreateUpdateCard } from './use-create-update-card.ts'

import { BlankCover, ImageOutline } from 'assets/icons'
import Button from 'components/ui/button/button.tsx'
import { ControlledTextField } from 'components/ui/controlled'
import { Modal } from 'components/ui/modal'

// eslint-disable-next-line
import s from './create-update-card.module.scss'

type Props = {
  deckId: string
  cardId?: string
  questionCover?: string | null
  answerCover?: string | null
  cardQuestion?: string
  cardAnswer?: string
  isUpdate?: boolean
  trigger?: ReactNode
}
export const CreateUpdateCardModal = ({
  questionCover,
  answerCover,
  cardId,
  cardAnswer,
  cardQuestion,
  isUpdate = false,
  trigger,
  deckId,
}: Props) => {
  const [questionFile, setQuestionFile] = useState<File | null>(null)
  const [answerFile, setAnswerFile] = useState<File | null>(null)

  const { open, setOpen, handleSubmit, control, handleCardSubmit } = useCreateUpdateCard({
    questionCover: questionFile,
    answerCover: answerFile,
    cardId,
    cardAnswer,
    cardQuestion,
    deckId,
    isUpdate,
  })

  // eslint-disable-next-line no-nested-ternary
  const whatToShowQuestion = questionFile
    ? URL.createObjectURL(questionFile)
    : questionCover
    ? questionCover
    : undefined

  // eslint-disable-next-line no-nested-ternary
  const whatToShowAnswer = answerFile
    ? URL.createObjectURL(answerFile)
    : answerCover
    ? answerCover
    : undefined

  const handleSetQuestionFile = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestionFile(e.target.files![0])
  }

  const handleSetAnswerFile = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerFile(e.target.files![0])
  }

  return (
    <Modal
      open={open}
      onClose={setOpen}
      trigger={trigger}
      title={isUpdate ? 'Edit Card' : 'Add New Card'}
    >
      <div className={s.coverModal}>
        {questionCover || questionFile ? (
          <img src={whatToShowQuestion} alt="questionCover" className={s.img} />
        ) : (
          <BlankCover />
        )}
      </div>

      <label htmlFor={'questionCover'}>
        <input
          type="file"
          accept={'image/*'}
          onChange={handleSetQuestionFile}
          id={'questionCover'}
          style={{ display: 'none' }}
        />
        <Button variant="secondary" as={'span'} fullWidth className={s.filePicker}>
          <ImageOutline /> Change Cover
        </Button>
      </label>

      <form onSubmit={handleSubmit(handleCardSubmit)} className={s.content}>
        <ControlledTextField name={'question'} control={control} label={'Question'} />
        <div className={s.coverModalInForm}>
          {answerCover || answerFile ? (
            <img src={whatToShowAnswer} alt="answerCover" className={s.img} />
          ) : (
            <BlankCover />
          )}
        </div>
        <label htmlFor={'answerCover'}>
          <input
            type="file"
            accept={'image/*'}
            onChange={handleSetAnswerFile}
            id={'answerCover'}
            style={{ display: 'none' }}
          />
          <Button variant="secondary" as={'span'} fullWidth>
            <ImageOutline /> Change Cover
          </Button>
        </label>
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
