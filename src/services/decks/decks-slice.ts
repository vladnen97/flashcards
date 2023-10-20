import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Sort } from 'components/ui/table'

const initialState = {
  searchByName: '',
  orderBy: null as Sort,
  cardsCount: [0, 100],
  authorId: '',
  currentPage: 1,
  itemsPerPage: 13,
}

export const decksSlice = createSlice({
  name: 'deckSlice',
  initialState,
  reducers: {
    setSearchByName: (state, action: PayloadAction<string>) => {
      state.searchByName = action.payload
      state.currentPage = 1
    },
    setAuthorId: (state, action: PayloadAction<string>) => {
      state.authorId = action.payload
      state.currentPage = 1
    },
    setCardsCount: (state, action: PayloadAction<number[]>) => {
      state.cardsCount = action.payload
      state.currentPage = 1
    },
    setOrderBy: (state, action: PayloadAction<Sort>) => {
      state.orderBy = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload
    },
    setClearFilters: state => {
      return {
        searchByName: '',
        orderBy: null,
        authorId: '',
        itemsPerPage: 13,
        currentPage: 1,
        cardsCount: [0, state.cardsCount[1]],
      }
    },
  },
})
