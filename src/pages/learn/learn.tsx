import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'

import { useGetDeckByIdQuery, useGetLearnQuery, useSaveGradeMutation } from '@/services/decks'
import { ArrowBackOutline } from 'assets/icons'
import Button from 'components/ui/button/button.tsx'
import { Card } from 'components/ui/card'
import { ControlledRadioGroup } from 'components/ui/controlled/controlled-radio-group'
import { Typography } from 'components/ui/typography'

// eslint-disable-next-line
import s from './learn.module.scss'

const options = [
  {
    value: 1,
    label: 'Did not know',
  },
  {
    value: 2,
    label: 'Forgot',
  },
  {
    value: 3,
    label: 'A lot of thought',
  },
  {
    value: 4,
    label: 'Confused',
  },
  {
    value: 5,
    label: 'Knew the answer',
  },
]

type SaveGradeFormValues = {
  grade: 0 | 1 | 2 | 3 | 4 | 5
}

export const Learn = () => {
  const { id: deckId } = useParams<{ id: string }>()
  const [previousCardId, setPreviousCardId] = useState<string | undefined>()
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const { data: deck } = useGetDeckByIdQuery(deckId || '')
  const { data: card } = useGetLearnQuery({
    id: deckId || '',
    previousCardId,
  })
  const [saveGrade] = useSaveGradeMutation()

  const { handleSubmit, control } = useForm<SaveGradeFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      grade: 1,
    },
  })

  const handleSaveGrade = (data: SaveGradeFormValues) => {
    saveGrade({ deckId: deck?.id || '', cardId: card?.id || '', ...data })
      .unwrap()
      .then(() => {
        setPreviousCardId(card?.id)
        setShowAnswer(false)
      })
  }

  return (
    <div>
      <Typography variant={'body2'} as={Link} to={'/'} className={s.backLink}>
        <ArrowBackOutline /> Back to Decks List
      </Typography>

      <Card className={s.card}>
        <Typography variant={'large'} as={'h1'} className={s.title}>
          Learn {deck?.name}
        </Typography>

        <div className={s.question}>
          <div>
            <Typography variant={'subtitle1'} as={'span'}>
              {'Question: '}
            </Typography>
            <Typography variant={'body1'} as={'span'}>
              {card?.question}
            </Typography>
          </div>
          <div>
            <Typography variant={'body2'} as={'span'} className={s.shots}>
              {'Количество попыток ответов на вопрос: '}
            </Typography>
            <Typography variant={'subtitle2'} as={'span'} className={s.shots}>
              {card?.shots}
            </Typography>
          </div>
        </div>
        {showAnswer ? (
          <>
            <div className={s.answer}>
              <div>
                <Typography variant={'subtitle1'} as={'span'}>
                  {'Answer: '}
                </Typography>
                <Typography variant={'body1'} as={'span'}>
                  {card?.answer}
                </Typography>
              </div>
            </div>
            <form onSubmit={handleSubmit(handleSaveGrade)}>
              <Typography variant={'subtitle1'} as={'div'}>
                Rate yourself:
              </Typography>
              <ControlledRadioGroup name={'grade'} control={control} options={options} />
              <Button fullWidth type={'submit'} className={s.learnBtn}>
                Next Question
              </Button>
            </form>
          </>
        ) : (
          <Button fullWidth onClick={() => setShowAnswer(true)}>
            Show Answer
          </Button>
        )}
      </Card>
    </div>
  )
}
