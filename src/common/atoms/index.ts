import { atom } from 'recoil';
import { AuthState, CartData } from '@constants';

const initialAuthState: AuthState = {
  token: null,
  csrf: null,
  currentUser: null,
};

const initialCartData: any = {
  carts: [],
  total_count: null,
};

const initialUserInfo: any = {
  id: null,
  name: null,
  email: null,
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: initialAuthState,
});

export const userInfo = atom<any>({
  key: 'userInfo',
  default: initialUserInfo,
});

export const cartData = atom<any>({
  key: 'cartData',
  default: initialCartData,
});
