import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Sort } from 'components/ui/table'

const initialState = {
  searchByQuestion: '',
  orderBy: null as Sort,
  currentPage: 1,
  itemsPerPage: 12,
}

export const cardsSlice = createSlice({
  name: 'cardsSlice',
  initialState,
  reducers: {
    setSearchByQuestion: (state, action: PayloadAction<string>) => {
      state.searchByQuestion = action.payload
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
  },
})
