import { useMemo, useState } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { useDebounce } from '@/common/hooks/useDebounce.ts'
import { CreateUpdateCardModal } from '@/pages/cards/create-update-card-modal'
import { DeleteCard } from '@/pages/cards/delete-card-modal'
import { CreateUpdateDeckModal } from '@/pages/decks/create-update-deck-modal'
import { DeleteDeckModal } from '@/pages/decks/delete-deck-modal'
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
const authorId = 'adc039be-37db-4b2b-9b9f-0ae24920336b'

export const Cards = () => {
  const searchByQuestion = useAppSelector(state => state.cardsSlice.searchByQuestion)
  const debouncedSearchByQuestion = useDebounce(searchByQuestion, 800)
  const orderBy = useAppSelector(state => state.cardsSlice.orderBy)
  const currentPage = useAppSelector(state => state.cardsSlice.currentPage)
  const itemsPerPage = useAppSelector(state => state.cardsSlice.itemsPerPage)
  const [open, setOpen] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const setSearchByQuestion = (value: string) => {
    dispatch(cardsSlice.actions.setSearchByQuestion(value))
  }
  const setOrderBy = (value: Sort) => {
    dispatch(cardsSlice.actions.setOrderBy(value))
  }
  const setCurrentPage = (value: number) => {
    dispatch(cardsSlice.actions.setCurrentPage(value))
  }

  const navigate = useNavigate()
  const { id: deckId } = useParams<{ id: string }>()
  const sortedString = useMemo(() => {
    if (!orderBy) return null

    return `${orderBy.key}-${orderBy.direction}`
  }, [orderBy])

  const { data: deckData, isLoading } = useGetDeckByIdQuery(deckId || '')
  const { data: cardsData } = useGetCardsQuery({
    id: deckId || '',
    itemsPerPage,
    question: debouncedSearchByQuestion,
    orderBy: sortedString,
    currentPage,
  })

  const isDeckOwner = deckData?.userId === authorId

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
                  <TableCell>{card.question}</TableCell>
                  <TableCell>{card.answer}</TableCell>
                  <TableCell>{new Date(card.updated).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{card.grade}</TableCell>
                  <TableCell>
                    {isDeckOwner && (
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <CreateUpdateCardModal
                          isUpdate
                          deckId={card.deckId}
                          cardId={card.id}
                          cardQuestion={card.question}
                          cardAnswer={card.answer}
                          trigger={<EditOutline />}
                        />
                        <DeleteCard
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
