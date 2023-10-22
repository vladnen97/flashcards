import { useEffect, useMemo } from 'react'

import { Link } from 'react-router-dom'

import { CreateUpdateDeckModal } from './create-update-deck-modal'
import { DeleteDeckModal } from './delete-deck-modal'

import { useDebounce } from '@/common/hooks/useDebounce.ts'
import { useMeQuery } from '@/services/auth'
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

export const Decks = () => {
  const { data: meData } = useMeQuery()
  const dispatch = useAppDispatch()

  const searchByName = useAppSelector(state => state.deckSlice.searchByName)
  const authorId = useAppSelector(state => state.deckSlice.authorId)
  const cardsCount = useAppSelector(state => state.deckSlice.cardsCount)
  const orderBy = useAppSelector(state => state.deckSlice.orderBy)
  const currentPage = useAppSelector(state => state.deckSlice.currentPage)
  const itemsPerPage = useAppSelector(state => state.deckSlice.itemsPerPage)

  const debouncedSearchValue = useDebounce(searchByName, 800)
  const debouncedCardsRange = useDebounce(cardsCount, 800)

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

  const sortedString = useMemo(() => {
    if (!orderBy) return null

    return `${orderBy.key}-${orderBy.direction}`
  }, [orderBy])

  let { currentData, data } = useGetDecksQuery({
    name: debouncedSearchValue,
    minCardsCount: debouncedCardsRange[0],
    maxCardsCount: debouncedCardsRange[1],
    orderBy: sortedString,
    itemsPerPage,
    authorId,
    currentPage,
  })

  if (!currentData && data) {
    currentData = { ...data }
  }

  useEffect(() => {
    if (cardsCount[1] !== currentData?.maxCardsCount) {
      setCardsCount([cardsCount[0], currentData?.maxCardsCount || 100])
    }
  }, [currentData?.maxCardsCount])

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
          <TabSwitcherItem value={meData?.id || ''}>
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
          max={currentData?.maxCardsCount}
        />
        <Button variant={'secondary'} onClick={setClearFilters}>
          Clear Filter
        </Button>
      </div>
      {!!currentData?.items.length && (
        <Table>
          <Head columns={columns} sort={orderBy} onSort={setOrderBy} />
          <TableBody>
            {currentData?.items.map(deck => {
              return (
                <TableRow key={deck.id}>
                  <TableCell>
                    <Typography as={Link} to={`/cards/${deck.id}`} className={s.deckLink}>
                      {deck.cover && (
                        <img src={deck.cover} alt={`${deck.name}-cover`} className={s.coverImage} />
                      )}
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
                      {meData?.id === deck.author.id && (
                        <>
                          <CreateUpdateDeckModal
                            isUpdate
                            cover={deck.cover}
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
          count={currentData?.pagination.totalPages || 1}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>
    </>
  )
}
