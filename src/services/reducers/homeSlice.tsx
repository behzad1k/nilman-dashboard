import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import restApi from '../restApi';

interface homeState {
  loading: boolean;
  statuses: any
}

const initialState: homeState = {
  loading: false,
  statuses: {}
};


const statuses = createAsyncThunk('status/fetch', async () => {
  return await restApi(process.env.REACT_APP_BASE_URL + '/order/status').get();
});

const homeSlice = createSlice({
  name: 'homeReducer',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }, extraReducers: (builder) => {
    builder.
      addCase(statuses.fulfilled, (state, action) => {
        if (action.payload.code == 200){
          action.payload.data?.map((status) => state.statuses[status.id] = status )
        }
    })
  }
});

export const {
  setLoading
} = homeSlice.actions;

export {
  statuses
}
const homeReducer = homeSlice.reducer;

export default homeReducer;
