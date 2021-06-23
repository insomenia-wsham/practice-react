import { Category, Item, Token } from '@constants';
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

export const getUser = (userId, params = null) => API.get(`users/${userId}`, { params });
export const updateUser = (userId, params = null) => API.put(`/users/${userId}`, { user: params });
// export const updatePassword = (userId, params = null) => API.put(`user/${userId}`, { user: params });

// 상품목록 조회
export const getItems = (params = null) => API.get<any>('/items', { params });

// 상품 상세정보 조회
export const getItem = (itemId) => async () => {
  const { data } = await API.get<any>(`/items/${itemId}`);
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
  const { data } = await API.get(`/carts`);
  return data;
};

// 장바구니 등록
export const createCart = () => async (params) => {
  const { data } = await API.post(`/carts`, { cart: params });
  return data;
};

// 장바구니 상품 삭제
export const deleteCartItem = () => async (params) => {
  const { data } = await API.delete(`/carts/${params.id}`);
  return data;
};

// 장바구니 수량 수정
export const updateCartItem = () => async (params) => {
  const { data } = await API.patch(`/carts/${params.id}`, { cart: params });
  return data;
};

// 관심목록 조회
export const getInterestList = () => async () => {
  const { data } = await API.get(`/interests`);
  return data;
};

// 관심상품 등록
export const createInterest = async (params, callback) => {
  const { data } = await API.post(`/interests`, { interest: params });
  callback(data);
  return data;
};

// 관심상품 삭제
export const deleteInterestItem = () => async (params) => {
  const { data } = await API.delete(`/interests/${params.id}`);
  return data;
};

// 주문목록 조회
export const getOrders = () => async () => {
  const { data } = await API.get(`/orders`);
  return data;
};

// 주문 등록
export const createOrder = async (params) => {
  const { data } = await API.post(`/orders`, { order: params });
  return data;
};

// 리뷰 관련 API
export const getReviews = (itemId) => async () => {
  const { data } = await API.get(`/items/${itemId}/reviews`);
  return data;
};

// 리뷰 등록
export const createReview = () => async (params) => {
  const { data } = await API.post(`/items/${params.item_id}/reviews`, { review: params });
  return data;
};

export { API_URL, VERSION };
