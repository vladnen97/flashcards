import { useMemo } from 'react'

import { Link } from 'react-router-dom'

import { CreateUpdateDeckModal } from './create-update-deck-modal'
import { DeleteDeckModal } from './delete-deck-modal'

import { useDebounce } from '@/common/hooks/useDebounce.ts'
import { useGetDecksQuery } from '@/services/decks'
import { decksSlice } from '@/services/decks/decks-slice.ts'
import { useAppDispatch, useAppSelector } from '@/services/store.ts'
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
const authorIdConst = 'f2be95b9-4d07-4751-a775-bd612fc9553a'

export const Decks = () => {
  const dispatch = useAppDispatch()
  const searchByName = useAppSelector(state => state.deckSlice.searchByName)
  const authorId = useAppSelector(state => state.deckSlice.authorId)
  const cardsCount = useAppSelector(state => state.deckSlice.cardsCount)
  const orderBy = useAppSelector(state => state.deckSlice.orderBy)
  const currentPage = useAppSelector(state => state.deckSlice.currentPage)
  const itemsPerPage = useAppSelector(state => state.deckSlice.itemsPerPage)

  const setSearchByName = (value: string) => {
    dispatch(decksSlice.actions.setSearchByName(value))
  }
  const setAuthorId = (value: string) => {
    dispatch(decksSlice.actions.setAuthorId(value))
  }
  const setCardsCount = (value: number[]) => {
    dispatch(decksSlice.actions.setCardsCount(value))
  }
  const setOrderBy = (value: Sort) => {
    dispatch(decksSlice.actions.setOrderBy(value))
  }
  const setCurrentPage = (value: number) => {
    dispatch(decksSlice.actions.setCurrentPage(value))
  }
  const setClearFilters = () => {
    dispatch(decksSlice.actions.setClearFilters())
  }

  const debouncedSearchValue = useDebounce(searchByName, 800)
  const debouncedCardsRange = useDebounce(cardsCount, 800)

  const sortedString = useMemo(() => {
    if (!orderBy) return null

    return `${orderBy.key}-${orderBy.direction}`
  }, [orderBy])

  const { data } = useGetDecksQuery({
    name: debouncedSearchValue,
    minCardsCount: debouncedCardsRange[0],
    maxCardsCount: debouncedCardsRange[1],
    orderBy: sortedString,
    itemsPerPage,
    authorId,
    currentPage,
  })

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
          onClearClick={() => setSearchByName('')}
          value={searchByName}
          onChange={e => setSearchByName(e.target.value)}
        />
        <TabSwitcher label={'Show packs cards'} value={authorId} onValueChange={setAuthorId}>
          <TabSwitcherItem value={authorIdConst}>
            <Typography variant="body1" as={'div'}>
              My Decks
            </Typography>
          </TabSwitcherItem>
          <TabSwitcherItem value={''}>
            <Typography variant="body1" as={'div'}>
              All Decks
            </Typography>
          </TabSwitcherItem>
        </TabSwitcher>
        <Slider
          value={cardsCount}
          onValueChange={setCardsCount}
          multiple
          label={'Number of cards'}
          max={data?.maxCardsCount}
        />
        <Button variant={'secondary'} onClick={setClearFilters}>
          Clear Filter
        </Button>
      </div>
      {!!data?.items.length && (
        <Table>
          <Head columns={columns} sort={orderBy} onSort={setOrderBy} />
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
                      {authorIdConst === deck.author.id && (
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
        <Pagination
          count={data?.pagination.totalPages || 1}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>
    </>
  )
}
