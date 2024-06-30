import restApi from 'services/restApi';
import { createAsyncThunk, createSlice, PayloadAction, } from '@reduxjs/toolkit';

interface tickerState {
  euroPrice: number;
}

const initialState: tickerState = {
  euroPrice: 0
};

const euroPrice = createAsyncThunk('cart/fetch', async () => {
  return await restApi(process.env.REACT_APP_BASE_URL + '/setting/euroPrice', true).get();
})

const tickerSlice = createSlice({
  name: 'tickerReducer',
  initialState,
  reducers:{
  },
  extraReducers: (builder) => {
    builder
    .addCase(euroPrice.fulfilled, (state, action) => {
      if(action.payload?.data?.value) {
        state.euroPrice = Number(action.payload?.data?.value);
      }
    })
  }
});

export {
  euroPrice
}

const tickerReducer = tickerSlice.reducer;

export default tickerReducer;
