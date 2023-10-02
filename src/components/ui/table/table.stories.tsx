import { useState } from 'react'

import type { Meta, StoryObj } from '@storybook/react'

import {
  Column,
  Head,
  Sort,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './'

import { Grade } from 'components/ui/grade'

const meta = {
  title: 'Components/UI/Table',
  component: Table,
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const data = [
  {
    title: 'Project A',
    cardsCount: 10,
    updated: '2023-07-07',
    createdBy: 'John Doe',
  },
  {
    title: 'Project B',
    cardsCount: 5,
    updated: '2023-07-06',
    createdBy: 'Jane Smith',
  },
  {
    title: 'Project C',
    cardsCount: 8,
    updated: '2023-07-05',
    createdBy: 'Alice Johnson',
  },
  {
    title: 'Project D',
    cardsCount: 3,
    updated: '2023-07-07',
    createdBy: 'Bob Anderson',
  },
  {
    title: 'Project E',
    cardsCount: 12,
    updated: '2023-07-04',
    createdBy: 'Emma Davis',
  },
]

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
  },
  {
    key: 'createdBy',
    title: 'Created by',
  },
  {
    key: 'icons',
    title: '',
    sortable: false,
  },
]

const TableWithHooks = () => {
  const [sort, setSort] = useState<Sort>(null)

  console.log(sort)

  return (
    <Table>
      <Head columns={columns} sort={sort} onSort={setSort} />
      <TableBody>
        {data.map(item => (
          <TableRow key={item.title}>
            <TableCell>{item.title}</TableCell>
            <TableCell>{item.cardsCount}</TableCell>
            <TableCell>{item.updated}</TableCell>
            <TableCell>{item.createdBy}</TableCell>
            <TableCell>icons...</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export const Default: Story = {
  args: {
    children: (
      <>
        <TableHeader>
          <TableRow>
            <TableHead>Question</TableHead>
            <TableHead>Answer</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>How This works in JavaScript?</TableCell>
            <TableCell>This is how This works in JavaScript</TableCell>
            <TableCell>18.03.2021</TableCell>
            <TableCell>
              <Grade value={4} onClick={() => {}} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>How This works in JavaScript?</TableCell>
            <TableCell>This is how This works in JavaScript</TableCell>
            <TableCell>18.03.2021</TableCell>
            <TableCell>
              <Grade value={2} onClick={() => {}} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>How This works in JavaScript?</TableCell>
            <TableCell>This is how This works in JavaScript</TableCell>
            <TableCell>18.03.2021</TableCell>
            <TableCell>
              <Grade value={3} onClick={() => {}} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>How This works in JavaScript?</TableCell>
            <TableCell>This is how This works in JavaScript</TableCell>
            <TableCell>18.03.2021</TableCell>
            <TableCell>
              <Grade value={0} onClick={() => {}} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>How This works in JavaScript?</TableCell>
            <TableCell>This is how This works in JavaScript</TableCell>
            <TableCell>18.03.2021</TableCell>
            <TableCell>
              <Grade value={5} onClick={() => {}} />
            </TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
  },
}

export const WithSort = {
  render: () => <TableWithHooks />,
}
