import { Address } from '@constants';

interface DefaultProps {
  id: number;
  model_name: string;
  created_at: string;
  updated_at: string;
}

export interface User extends DefaultProps, Address {
  email: string;
  name: string;
  phone: string;
  image_path: string;
  status?: string;
  description?: string;
}

export interface Category extends DefaultProps {
  title: string;
  body: string;
  image_path: string;
}

export interface Image extends DefaultProps {
  imagable_type: string;
  imagable_id: number;
  image_path: string;
}

export interface Item extends DefaultProps {
  user_id: number;
  category_id: number;
  name: string;
  status: 'active' | 'disabled';
  list_price: number;
  sale_price: number;
  description: string;
  image_path: string;
  category?: Category;
  images?: Image[];
  user?: User;
}

export interface Post extends DefaultProps {
  user_id: number;
  title: string;
  content: string;
  user: User;
}

export interface ItemList {
  item_id: number;
  name: string;
  list_price: number;
  sale_price: number;
  image_path: string;
  item_count: number;
}

export interface Cart extends DefaultProps {
  id: number;
  item_id: number;
  user_id: number;
  item_count: number;
  item: any[];
}
