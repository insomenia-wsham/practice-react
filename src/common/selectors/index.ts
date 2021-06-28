import _ from 'lodash';
import { selector, selectorFamily } from 'recoil';
import { AuthState, CartData } from '@constants';
import { authState, cartData, userInfo } from '@atoms';

export const authSelector = selector({
  key: 'authSelector',
  get: ({ get }) => get(authState),
  set: ({ set }, newAuthState: AuthState) => set(authState, newAuthState),
});

export const cartSelector = selector({
  key: 'cartSelector',
  get: ({ get }) => get(cartData),
  set: ({ set }, newCartData: any) => set(cartData, newCartData),
});

export const userSelector = selector({
  key: 'userSelector',
  get: ({ get }) => get(userInfo),
  set: ({ set }, newUserInfo: any) => set(userInfo, newUserInfo),
});
