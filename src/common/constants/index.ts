import React from 'react';
import { Router } from 'framework7/types';
import packageJson from '../../../package.json';
import { Cart, Item } from './schema';

export * from './schema';

/** 리터럴 혹은 불변 객체 */
export const TOKEN_KEY = `${packageJson.name}_TOKEN`;
export const CSRF_KEY = `${packageJson.name}_CSRF`;

export const ACTIONS = {
  NEW: 'new',
  INDEX: 'index',
  EDIT: 'edit',
  SHOW: 'show',
};

export const DEFAULT_ACTIONS = Object.values(ACTIONS);

/** 인터페이스 */
/* User Auth Interfaces */
export interface Token {
  token: null | string;
  csrf: null | string;
}

export interface AuthState extends Token {
  // isLoading: boolean;
  currentUser: CurrentUser; // TODO currentUser 인터페이스화
}

export interface CurrentUser {
  id: number;
  email: string;
  name: string;
  gender: string;
  image_path: string;
}

export interface TokenPayload {
  user: any; // TODO IToknePayload any 타입 변경
}
// Shared

export interface PageRouteProps {
  f7route: Router.Route;
  f7router: Router.Router;
}

export interface Address {
  zipcode: string;
  address1: string;
  address2?: string;
}

/* API 관련 타입 정의 */

export interface CartData {
  carts: Cart;
  total_count: number;
}

export interface CartItem {
  id: number;
  item_count: number;
  item_id: number;
}

export interface CreateOrder {
  user_id: number;
  item_list: any[]; // TODO item_list 타입 정의
  receiver_zipcode: string;
  receiver_address: string;
  receiver_address_detail: string;
  receiver_name: string;
  direct?: boolean;
}

export interface IterestData {
  interests: any[]; // TODO interests 타입 정의
  total_count: number;
}

export interface OrderDetail extends Item {
  id: number;
  item_id: number;
  order_id: number;
  order_price: number;
  updated_at: string;
  created_at: string;
}

export interface Order extends CreateOrder {
  id: number;
  order_details: OrderDetail[];
  updated_at: string;
  created_at: string;
}

export interface User {
  description?: string;
  email: string;
  id: number;
  image_ids?: any;
  image_path: string;
  name: string;
}

export interface Review {
  content: string;
  id: number;
  item_id: number;
  user: User;
  created_at: string;
  updated_at: string;
}

export interface ReviewData {
  reviews: Review[];
  total_count: number;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
}
