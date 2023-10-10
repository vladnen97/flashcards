import { useMemo, useState } from 'react'

import { Link, useNavigate, useParams } from 'react-router-dom'

import { CreateCard } from '@/pages/cards/create-card-modal'
import { DeleteCard } from '@/pages/cards/delete-card-modal'
import { UpdateCard } from '@/pages/cards/update-card-modal'
import { DeleteDeck } from '@/pages/decks/delete-pack'
import { EditDeck } from '@/pages/decks/edit-deck'
import { useGetCardsQuery } from '@/services/cards'
import { useGetDeckByIdQuery } from '@/services/decks'
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
const authorId = 'f2be95b9-4d07-4751-a775-bd612fc9553a'

export const Cards = () => {
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [sort, setSort] = useState<Sort>(null)
  const { id: deckId } = useParams<{ id: string }>()
  const sortedString = useMemo(() => {
    if (!sort) return null

    return `${sort.key}-${sort.direction}`
  }, [sort])

  const { data: deckData, isLoading } = useGetDeckByIdQuery(deckId || '')
  const { data: cardsData } = useGetCardsQuery({
    id: deckId || '',
    itemsPerPage: '12',
    question: search,
    orderBy: sortedString,
    currentPage: page,
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
            <Dropdown trigger={<MoreVerticalOutline />}>
              <DropdownItemWithIcon
                icon={<PlayCircleOutline />}
                text={'Learn'}
                onSelect={() => navigate(`/learn/${deckId}`)}
              />
              <DropdownItem onSelect={e => e.preventDefault()}>
                <EditDeck
                  deckId={deckData.id}
                  deckName={deckData.name}
                  isPrivateDeck={deckData.isPrivate}
                  trigger={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <EditOutline />
                      <Typography variant="caption">Edit</Typography>
                    </div>
                  }
                />
              </DropdownItem>
              <DropdownItem onSelect={e => e.preventDefault()}>
                <DeleteDeck
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
          )}
        </div>

        {!!cardsData?.items.length && isDeckOwner && (
          <CreateCard deckId={deckId || ''} trigger={<Button>Add New Card</Button>} />
        )}
        {!!cardsData?.items.length && !isDeckOwner && <Button>Learn to Deck</Button>}
      </div>
      <div className={s.input}>
        <TextField
          value={search}
          onChange={e => setSearch(e.target.value)}
          search
          onClearClick={() => setSearch('')}
        />
      </div>

      {!cardsData?.items.length ? (
        <div className={s.noCards}>
          <Typography variant={'body1'} className={s.text}>
            This pack is empty. {isDeckOwner && 'Click add new card to fill this pack'}
          </Typography>
          {isDeckOwner && (
            <CreateCard deckId={deckId || ''} trigger={<Button>Add New Card</Button>} />
          )}
        </div>
      ) : (
        <Table>
          <Head columns={columns} sort={sort} onSort={setSort} />
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
                        <UpdateCard
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
        <Pagination count={cardsData?.pagination.totalPages || 1} page={page} onChange={setPage} />
      </div>
    </>
  )
}
