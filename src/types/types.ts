// export interface SignUpParams {
//   displayName: string;
//   username: string;
//   email: string;
//   password: string;
// }

// export interface LoginParams {
//   email: string;
//   password: string;
// }

export interface IService {
  id: number;
  title: string;
  description: string;
  price: number;
  slug: string;
  section: number;
  parent?: IService;
  parentId?: number;
  attributes?: IService[];
  hasColor: boolean;
  color?: string;
  media: any
}

export interface IAddress {
  id: number;
  title: string;
  phoneNumber?: string;
  longitude: number;
  latitude: number;
  description: string;
}


export type Position = {
  lat: number;
  lng: number;
};


export interface IOrder {
  attributes: IService[];
  id: number;
  title: string;
  price: number;
  date: string;
  time: string;
  code: string;
  discount: number;
  discountAmount: number;
  transportation: number | string;
  status: 'ACCEPTED' | 'PAID' | 'Done' | 'CREATED' | 'ASSIGNED' | 'CANCELED';
  worker: IUser;
  service: IService;
  attribute?: IService;
  address?: IAddress;
  fromTime: number;
  toTime: number;
  done: boolean;
}
export interface IUser {
  id: number;
  name: string;
  lastName: string;
  nationalCode: string;
  phoneNumber: string;
  role: 'USER' | 'WORKER' | 'OPERATOR' | 'SUPER_ADMIN';
  media: { url: string}
}

export interface ISliderCardInfo {
  title: string;
  url: string;
}


export interface User {
  id?: string;
  name: string;
  lastName: string;
  phoneNumber: string;
  nationalCode: string;
  isVerified: boolean;
  walletBalance?: number;
  addresses?: Address[];
}

export interface Address {
  id: string | null;
  title: string;
  phoneNumber: string;
  description: string;
  vahed: string;
  pelak: string;
  longitude?: number;
  latitude?: number;
}

export interface OrderService {
  id?: string | null;
  serviceId: number;
  count: number;
  colors?: number[];
  singlePrice?: number;
}

export interface Payment {
  id?: string;
  method: string;
  price: number;
  shouldUseWallet: boolean;
  refId?: string;
  description?: string;
  isPaid?: boolean;
}

export interface OrderFormState {
  isMulti: boolean;
  orderServices: OrderService[];
  transportation: number;
  finalPrice: number;
  price: number;
  discountAmount: number;
  serviceId: number | null;
  date: string;
  time?: string;
  shouldUseWallet: boolean;
  isUrgent: boolean;
  status?: string;
  code?: string;
  address: Address;
  addressId?: string;
  user?: User;
  createdAt?: string;
  payment: Payment;
  finalImage?: {
    url: string;
    id: string;
  };
  doneDate?: string;
  startDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
