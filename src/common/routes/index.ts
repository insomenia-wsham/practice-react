import NotFoundPage from '@pages/404';
import HomePage from '@pages/home';
import IntroPage from '@pages/intro';
import ItemIndexPage from '@pages/items';
import ItemShowPage from '@pages/items/show';
import PostIndexPage from '@pages/posts/index';
import PostShowPage from '@pages/posts/show';
import PostNewPage from '@pages/posts/new';
import PostEditPage from '@pages/posts/edit';
import MyPage from '@pages/mypage';
import SignUpPage from '@pages/users/registrations/new';
import LoginPage from '@pages/users/sessions/new';
import UserEditPage from '@pages/users/edit';
import CartIndexPage from '@pages/carts';
import InterestIndexPage from '@pages/interests';
import OrderIndexPage from '@pages/orders';
import OrderNewPage from '@pages/orders/new';

import CategoryIndexPage from '@pages/category';

const routes = [
  { path: '/', component: HomePage },
  { path: '/users/sign_in', component: LoginPage },
  { path: '/users/sign_up', component: SignUpPage },
  { path: '/users/:id', component: UserEditPage },
  { path: '/intro', component: LoginPage },
  { path: '/mypage', component: MyPage },
  { path: '/items', component: ItemIndexPage },
  { path: '/items/:id', component: ItemShowPage },
  { path: '/carts', component: CartIndexPage },
  { path: '/interests', component: InterestIndexPage },
  { path: '/orders', component: OrderIndexPage },
  { path: '/orders/new', component: OrderNewPage },

  { path: '/category', component: CategoryIndexPage },

  { path: '/posts', component: PostIndexPage },
  { path: '/posts/new', component: PostNewPage },
  { path: '/posts/:id', component: PostShowPage },
  { path: '/posts/:id/edit', component: PostEditPage },
  { path: '(.*)', component: NotFoundPage },
];

export default routes;
