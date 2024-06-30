import restApi from 'services/restApi';
import { createAsyncThunk, createSlice, PayloadAction, } from '@reduxjs/toolkit';
import tools from '../../utils/tools';

interface userState {
  profile: any;
  orders: any[];
  address: any;
  favorites: any[];
  cart: any;
}

const initialState: userState = {
  profile: {},
  orders: [],
  address: {},
  favorites: [],
  cart: {}
};

const fetchProfile = createAsyncThunk('profile/fetch', async () => {
  return await restApi(process.env.REACT_APP_BASE_URL + '/user', true).get();
});

const orders = createAsyncThunk('orders/fetch', async () => {
  return await restApi(process.env.REACT_APP_BASE_URL + '/order', true).get();
});

const address = createAsyncThunk('address/fetch', async () => {
  return await restApi(process.env.REACT_APP_BASE_URL + '/address', true).get();
})

const favorites = createAsyncThunk('favorites/fetch', async () => {
  return await restApi(process.env.REACT_APP_BASE_URL + '/product/favorites/all', true).get();
})

const cart = createAsyncThunk('cart/fetch', async () => {
  return await restApi(process.env.REACT_APP_BASE_URL + '/cart', true).get();
})

const userSlice = createSlice({
  name: 'userReducer',
  initialState,
  reducers:{
    profile: (state, action: PayloadAction<any> ) => {
      state.profile = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProfile.fulfilled, (state, action) => {
      state.profile = action.payload?.data
    })
    .addCase(orders.fulfilled, (state, action) => {
      state.orders = action.payload?.data
    })
    .addCase(address.fulfilled, (state, action) => {
      state.address = action.payload?.data
    })
    .addCase(favorites.fulfilled, (state, action) => {
      state.favorites = action.payload?.data
    })
    .addCase(cart.fulfilled, (state, action) => {
      state.cart = action.payload?.data
    })
  }
});

export const { profile } = userSlice.actions
export {
  fetchProfile,
  address,
  favorites,
  cart,
  orders
}

const userReducer = userSlice.reducer;

export default userReducer;
