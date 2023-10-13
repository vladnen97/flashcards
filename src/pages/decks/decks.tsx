import { useMemo, useState } from 'react'

import { Link } from 'react-router-dom'

import { CreateUpdateDeckModal } from './create-update-deck-modal'
import { DeleteDeckModal } from './delete-deck-modal'

import { useDebounce } from '@/common/hooks/useDebounce.ts'
import { useGetDecksQuery } from '@/services/decks'
import { EditOutline, PlayCircleOutline, TrashOutline } from 'assets/icons'
import Button from 'components/ui/button/button.tsx'
import { Pagination } from 'components/ui/pagination'
import { Slider } from 'components/ui/slider'
import { TabSwitcher, TabSwitcherItem } from 'components/ui/tab-switcher'
import { Column, Head, Sort, Table, TableBody, TableCell, TableRow } from 'components/ui/table'
import { TextField } from 'components/ui/text-field'
import { Typography } from 'components/ui/typography'

// eslint-disable-next-line
import s from './decks.module.scss'

const columns: Column[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    key: 'cardsCount',
    title: 'Cards',
    sortable: true,
  },
  {
    key: 'updated',
    title: 'Last Updated',
    sortable: true,
  },
  {
    key: 'created',
    title: 'Created by',
    sortable: true,
  },
  {
    key: 'icons',
    title: '',
  },
]
const authorId = 'f2be95b9-4d07-4751-a775-bd612fc9553a'

export const Decks = () => {
  const [name, setName] = useState<string>('')
  const debouncedSearchValue = useDebounce(name, 800)
  const [cardsCountRange, setCardsCountRange] = useState<number[]>([0, 100])
  const debouncedCardsRange = useDebounce(cardsCountRange, 800)
  const [page, setPage] = useState<number>(1)
  const [showAuthorDeck, setShowAuthorDeck] = useState<'myDeck' | 'allDeck'>('allDeck')
  const [sort, setSort] = useState<Sort>(null)
  const sortedString = useMemo(() => {
    if (!sort) return null

    return `${sort.key}-${sort.direction}`
  }, [sort])

  const { data } = useGetDecksQuery({
    name: debouncedSearchValue,
    minCardsCount: debouncedCardsRange[0],
    maxCardsCount: debouncedCardsRange[1],
    orderBy: sortedString,
    itemsPerPage: 13,
    authorId: showAuthorDeck === 'myDeck' ? authorId : '',
    currentPage: page,
  })

  const clearFilter = () => {
    setName('')
    setShowAuthorDeck('allDeck')
    setCardsCountRange([0, data?.maxCardsCount || 100])
  }

  return (
    <>
      <div className={s.title}>
        <Typography variant={'large'} as={'h1'}>
          Decks list
        </Typography>
        <CreateUpdateDeckModal trigger={<Button>Add New Deck</Button>} />
      </div>
      <div className={s.filters}>
        <TextField
          placeholder={"Enter deck's name"}
          search
          onClearClick={() => setName('')}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <TabSwitcher
          label={'Show packs cards'}
          value={showAuthorDeck}
          onValueChange={() =>
            setShowAuthorDeck(state => (state === 'myDeck' ? 'allDeck' : 'myDeck'))
          }
        >
          <TabSwitcherItem value={'myDeck'}>
            <Typography variant="body1" as={'div'}>
              My Decks
            </Typography>
          </TabSwitcherItem>
          <TabSwitcherItem value={'allDeck'}>
            <Typography variant="body1" as={'div'}>
              All Decks
            </Typography>
          </TabSwitcherItem>
        </TabSwitcher>
        <Slider
          value={cardsCountRange}
          onValueChange={setCardsCountRange}
          multiple
          label={'Number of cards'}
          max={data?.maxCardsCount}
        />
        <Button variant={'secondary'} onClick={clearFilter}>
          Clear Filter
        </Button>
      </div>
      {!!data?.items.length && (
        <Table>
          <Head columns={columns} sort={sort} onSort={setSort} />
          <TableBody>
            {data?.items.map(deck => {
              return (
                <TableRow key={deck.id}>
                  <TableCell>
                    <Typography as={Link} to={`/cards/${deck.id}`} className={s.deckLink}>
                      {deck.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{deck.cardsCount}</TableCell>
                  <TableCell>{new Date(deck.updated).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{deck.author.name}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <Typography as={Link} to={`/learn/${deck.id}`}>
                        <PlayCircleOutline />
                      </Typography>
                      {authorId === deck.author.id && (
                        <>
                          <CreateUpdateDeckModal
                            isUpdate
                            deckId={deck.id}
                            deckName={deck.name}
                            isPrivateDeck={deck.isPrivate}
                            trigger={<EditOutline />}
                          />
                          <DeleteDeckModal
                            deckId={deck.id}
                            deckName={deck.name}
                            trigger={<TrashOutline />}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
      <div className={s.pagination}>
        <Pagination count={data?.pagination.totalPages || 1} page={page} onChange={setPage} />
      </div>
    </>
  )
}
