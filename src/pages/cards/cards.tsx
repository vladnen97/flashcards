import { useMemo, useState } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { useDebounce } from '@/common/hooks/useDebounce.ts'
import { CreateUpdateCardModal } from '@/pages/cards/create-update-card-modal'
import { DeleteCard } from '@/pages/cards/delete-card-modal'
import { CreateUpdateDeckModal } from '@/pages/decks/create-update-deck-modal'
import { DeleteDeckModal } from '@/pages/decks/delete-deck-modal'
import { useMeQuery } from '@/services/auth'
import { useGetCardsQuery } from '@/services/cards'
import { cardsSlice } from '@/services/cards/cards-slice.ts'
import { useGetDeckByIdQuery } from '@/services/decks'
import { useAppDispatch, useAppSelector } from '@/services/store.ts'
import {
  ArrowBackOutline,
  EditOutline,
  MoreVerticalOutline,
  PlayCircleOutline,
  TrashOutline,
} from 'assets/icons'
import Button from 'components/ui/button/button.tsx'
import { Dropdown, DropdownItem, DropdownItemWithIcon } from 'components/ui/dropdown'
import { Pagination } from 'components/ui/pagination'
import { Column, Head, Sort, Table, TableBody, TableCell, TableRow } from 'components/ui/table'
import { TextField } from 'components/ui/text-field'
import { Typography } from 'components/ui/typography'

// eslint-disable-next-line
import s from './cards.module.scss'

const columns: Column[] = [
  { key: 'question', sortable: true, title: 'Question' },
  { key: 'answer', sortable: true, title: 'Answer' },
  { key: 'updated', sortable: true, title: 'Last Updated' },
  { key: 'grade', sortable: true, title: 'Grade' },
  { key: 'actions', sortable: false, title: '' },
]

export const Cards = () => {
  const searchByQuestion = useAppSelector(state => state.cardsSlice.searchByQuestion)
  const debouncedSearchByQuestion = useDebounce(searchByQuestion, 800)
  const orderBy = useAppSelector(state => state.cardsSlice.orderBy)
  const currentPage = useAppSelector(state => state.cardsSlice.currentPage)
  const itemsPerPage = useAppSelector(state => state.cardsSlice.itemsPerPage)
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const { id: deckId } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { data: meData } = useMeQuery()

  const sortedString = useMemo(() => {
    if (!orderBy) return null

    return `${orderBy.key}-${orderBy.direction}`
  }, [orderBy])

  const { data: deckData, isLoading } = useGetDeckByIdQuery(deckId || '')
  const { currentData: cardsData } = useGetCardsQuery({
    id: deckId || '',
    itemsPerPage,
    question: debouncedSearchByQuestion,
    orderBy: sortedString,
    currentPage,
  })

  const setSearchByQuestion = (value: string) => {
    dispatch(cardsSlice.actions.setSearchByQuestion(value))
  }
  const setOrderBy = (value: Sort) => {
    dispatch(cardsSlice.actions.setOrderBy(value))
  }
  const setCurrentPage = (value: number) => {
    dispatch(cardsSlice.actions.setCurrentPage(value))
  }

  const isDeckOwner = deckData?.userId === (meData?.id || '')

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <>
      <Typography variant={'body2'} as={Link} to={'/'} className={s.backLink}>
        <ArrowBackOutline /> Back to Decks List
      </Typography>
      <div className={s.header}>
        <div className={s.title}>
          <Typography variant={'large'} as={'h1'}>
            {deckData?.name}
          </Typography>

          {isDeckOwner && (
            <>
              <Dropdown trigger={<MoreVerticalOutline />}>
                <DropdownItemWithIcon
                  icon={<PlayCircleOutline />}
                  text={'Learn'}
                  onSelect={() => navigate(`/learn/${deckId}`)}
                />
                <DropdownItemWithIcon
                  icon={<EditOutline />}
                  text={'Edit'}
                  onSelect={() => setOpen(true)}
                />
                <DropdownItem onSelect={e => e.preventDefault()}>
                  <DeleteDeckModal
                    deckId={deckId || ''}
                    deckName={deckData.name}
                    trigger={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <TrashOutline />
                        <Typography variant="caption">Delete</Typography>
                      </div>
                    }
                  />
                </DropdownItem>
              </Dropdown>
              <CreateUpdateDeckModal
                openModal={open}
                setOpenModal={setOpen}
                isUpdate
                deckId={deckData.id}
                deckName={deckData.name}
                isPrivateDeck={deckData.isPrivate}
              />
            </>
          )}
        </div>

        {!!cardsData?.items.length && isDeckOwner && (
          <CreateUpdateCardModal deckId={deckId || ''} trigger={<Button>Add New Card</Button>} />
        )}
        {!!cardsData?.items.length && !isDeckOwner && (
          <Button onClick={() => navigate(`/learn/${deckId}`)}>Learn to Deck</Button>
        )}
      </div>
      <div className={s.imgBlock}>
        {deckData?.cover && (
          <img src={deckData?.cover} alt={`${deckData?.name}-cover`} className={s.coverImage} />
        )}
      </div>
      <div className={s.input}>
        <TextField
          value={searchByQuestion}
          onChange={e => setSearchByQuestion(e.target.value)}
          search
          onClearClick={() => setSearchByQuestion('')}
        />
      </div>

      {!cardsData?.items.length ? (
        <div className={s.noCards}>
          <Typography variant={'body1'} className={s.text}>
            This pack is empty. {isDeckOwner && 'Click add new card to fill this pack'}
          </Typography>
          {isDeckOwner && (
            <CreateUpdateCardModal deckId={deckId || ''} trigger={<Button>Add New Card</Button>} />
          )}
        </div>
      ) : (
        <Table>
          <Head columns={columns} sort={orderBy} onSort={setOrderBy} />
          <TableBody>
            {cardsData?.items.map(card => {
              return (
                <TableRow key={card.id}>
                  <TableCell>
                    <div className={s.tableCellWithCover}>
                      {card.questionImg && (
                        <img
                          src={card.questionImg}
                          alt={`${card.question}-cover`}
                          className={s.coverImageTable}
                        />
                      )}
                      {card.question}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={s.tableCellWithCover}>
                      {card.answerImg && (
                        <img
                          src={card.answerImg}
                          alt={`${card.answer}-cover`}
                          className={s.coverImageTable}
                        />
                      )}
                      {card.answer}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(card.updated).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{card.grade || 0}</TableCell>
                  <TableCell>
                    {isDeckOwner && (
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <CreateUpdateCardModal
                          isUpdate
                          answerCover={card.answerImg}
                          questionCover={card.questionImg}
                          deckId={card.deckId}
                          cardId={card.id}
                          cardQuestion={card.question}
                          cardAnswer={card.answer}
                          trigger={<EditOutline />}
                        />
                        <DeleteCard
                          deckId={deckId || ''}
                          cardId={card.id}
                          cardName={card.question}
                          trigger={<TrashOutline />}
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
      <div className={s.pagination}>
        <Pagination
          count={cardsData?.pagination.totalPages || 1}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>
    </>
  )
}
