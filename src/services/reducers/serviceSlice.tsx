import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import endpoints from '../../config/endpoints';
import { IService } from '../../types/types';
import tools from '../../utils/tools';
import restApi from '../restApi';
interface serviceState {
  services: IService[];
  allServices: IService[];
}

const initialState: serviceState = {
  services: [],
  allServices: []
};
export const services = createAsyncThunk('services/fetchServices', async () => {
  return await restApi(endpoints.service.client).get({ type: 'children'});
});

export const serviceSlice = createSlice({
  name: 'serviceSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(services.fulfilled, (state, action) => {
      if (action.payload.code == 200) {
        const sortedData = [];

        action.payload.data.map(e => tools.extractChildren(e, sortedData));

        state.allServices = sortedData;
        state.services = action.payload.data;
      }
    });
  },
});

export const {} = serviceSlice.actions;

const serviceReducer = serviceSlice.reducer;
export default serviceReducer;
