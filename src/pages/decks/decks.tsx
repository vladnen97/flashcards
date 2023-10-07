import { useMemo, useState } from 'react'

import { useGetDecksQuery } from '@/services/decks'
import { EditOutline, PlayCircleOutline, TrashOutline } from 'assets/icons'
import { AddNewPack } from 'components/modals/add-new-pack'
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
  const [name, setName] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [showAuthorDeck, setShowAuthorDeck] = useState<'myDeck' | 'allDeck'>('allDeck')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [cardsCountRange, setCardsCountRange] = useState<number[]>([0, 100])
  const [sort, setSort] = useState<Sort>(null)
  const sortedString = useMemo(() => {
    if (!sort) return null

    return `${sort.key}-${sort.direction}`
  }, [sort])

  const { data } = useGetDecksQuery({
    name,
    minCardsCount: cardsCountRange[0],
    maxCardsCount: cardsCountRange[1],
    orderBy: sortedString,
    itemsPerPage: '13',
    authorId: showAuthorDeck === 'myDeck' ? 'f2be95b9-4d07-4751-a775-bd612fc9553a' : '',
    currentPage: page,
  })

  const clearFilter = () => {
    setName('')
    setShowAuthorDeck('allDeck')
    setCardsCountRange([0, 100])
  }

  return (
    <>
      <div className={s.title}>
        <Typography variant={'large'} as={'h1'}>
          Decks list
        </Typography>
        <AddNewPack
          trigger={<Button>Add New Deck</Button>}
          open={showModal}
          onClose={() => setShowModal(state => !state)}
          onSubmit={data => console.log(data)}
        />
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
      {data?.items.length ? (
        <Table>
          <Head columns={columns} sort={sort} onSort={setSort} />
          <TableBody>
            {data?.items.map(deck => {
              return (
                <TableRow key={deck.id}>
                  <TableCell>{deck.name}</TableCell>
                  <TableCell>{deck.cardsCount}</TableCell>
                  <TableCell>{new Date(deck.updated).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{deck.author.name}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <PlayCircleOutline />
                      <EditOutline />
                      <TrashOutline />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      ) : (
        <Typography variant={'h2'}>
          No decks with the entered filters were found 😔. Change request parameters
        </Typography>
      )}
      <div className={s.pagination}>
        <Pagination count={data?.pagination.totalPages || 1} page={page} onChange={setPage} />
      </div>
    </>
  )
}
