import {
  Category,
  Item,
  Token,
  CartData,
  CreateOrder,
  CartItem,
  Order,
  Review,
  ReviewData,
  IterestData,
} from '@constants';
import { getToken } from '@store';
import { data } from 'dom7';
import { PlainAPI, API, VERSION, API_URL } from './api.config';
import { ApiService } from './api.service';

export const refresh = (): Promise<{ data: Token }> =>
  PlainAPI.post(
    '/token',
    {},
    {
      headers: { 'X-CSRF-TOKEN': getToken().csrf, Authorization: `Bearer ${getToken().token}` },
    },
  );

export const get = (url: string, params: any) => PlainAPI.get(url, params);
export const loginAPI = (params: any) => PlainAPI.post('/login', { user: params });
export const signupAPI = (params: any) => PlainAPI.post('/signup', { user: params });
export const logoutAPI = () => API.delete('/logout');

export const updateUser = (userId, params = null) => API.put(`/users/${userId}`, { user: params });
export const updatePassword = (params = null) => API.put(`/signup`, { user: params });

// 상품목록 조회
export const getItems = (params = null) => API.get<any>('/items', { params });

// 상품 상세정보 조회
export const getItem = (itemId: number) => async () => {
  const { data } = await API.get<Item>(`/items/${itemId}`);
  return data;
};

// 카테고리 관련 API
export const getCategories = (params = null) => API.get<Category[]>('/categories', { params });
export const getCategory = (id, params = null) => API.get<Category>(`/categories/${id}`, { params });

export const getPosts =
  () =>
  async (params = null) => {
    const { data } = await API.get('/posts', { params });
    return data;
  };
export const getPost = (postId) => async () => {
  const { data } = await API.get<any>(`/posts/${postId}`);
  return data;
};
export const createPost = (params) => API.post('/posts', { post: params });
export const updatePost = (postId, params) => API.patch(`/posts/${postId}`, { post: params });
export const destroyPost = (postId) => API.delete(`/posts/${postId}`);

// 장바구니 목록 조회
export const getCarts = () => async () => {
  const { data } = await API.get<CartData>(`/carts`);
  return data;
};

// 장바구니 등록
export const createCart = () => async (params: { item_id: number; item_count: number }) => {
  const { data } = await API.post<{ success: boolean }>(`/carts`, { cart: params });
  return data;
};

// 장바구니 상품 삭제
export const deleteCartItem = () => async (params: { id: number }) => {
  const { data } = await API.delete<CartItem>(`/carts/${params.id}`);
  return data;
};

// 장바구니 수량 수정
export const updateCartItem = () => async (params: { id: number; item_count: number }) => {
  const { data } = await API.patch<CartItem>(`/carts/${params.id}`, { cart: params });
  return data;
};

// 관심목록 조회
export const getInterestList = () => async () => {
  const { data } = await API.get<IterestData>(`/interests`);
  return data;
};

// 관심상품 등록
export const createInterest = async (params: { item_id: number }, callback) => {
  const { data } = await API.post<{ success: boolean }>(`/interests`, { interest: params });
  callback(data);
  return data;
};

// 관심상품 삭제
export const deleteInterestItem = () => async (params: { id: number }) => {
  const { data } = await API.delete<{ id: number; item_id: number }>(`/interests/${params.id}`);
  return data;
};

// 주문목록 조회
export const getOrders = () => async () => {
  const { data } = await API.get<Order[]>(`/orders`);
  return data;
};

// 주문 등록
export const createOrder = async (params: CreateOrder) => {
  const { data } = await API.post<{ message: string }>(`/orders`, { order: params });
  return data;
};

// 리뷰 관련 API
export const getReviews = (itemId: number) => async () => {
  const { data } = await API.get<ReviewData>(`/items/${itemId}/reviews`);
  return data;
};

// 리뷰 등록
export const createReview = () => async (params: { item_id: number; content: string }) => {
  const { data } = await API.post<Review>(`/items/${params.item_id}/reviews`, {
    review: { content: params.content },
  });
  return data;
};

// 리뷰 삭제
export const deleteReview = () => async (params: { id: number; item_id: number }) => {
  const { data } = await API.delete<Review>(`/items/${params.item_id}/reviews/${params.id}`);
  return data;
};

export { API_URL, VERSION };
