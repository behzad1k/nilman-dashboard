import { OrderFormState } from '../types/types';

export const initialFormState: OrderFormState = {
  isMulti: false,
  orderServices: [],
  transportation: 0,
  finalPrice: 0,
  price: 0,
  discountAmount: 0,
  serviceId: null,
  date: '',
  time: '',
  shouldUseWallet: false,
  isUrgent: false,
  status: 'pending',
  address: {
    id: null,
    title: '',
    phoneNumber: '',
    description: '',
    vahed: '',
    pelak: ''
  },
  user: {
    id: '',
    name: '',
    lastName: '',
    phoneNumber: '',
    nationalCode: '',
    isVerified: false,
    addresses: []
  },
  payment: {
    method: 'online',
    price: 0,
    shouldUseWallet: false,
    isPaid: false
  }
};
