import { getOrders } from '@api';
import { PageRouteProps } from '@constants';
import { Navbar, Page, List, ListItem } from 'framework7-react';
import React from 'react';
import { useQuery } from 'react-query';
import useAuth from '@hooks/useAuth';
import { configs } from '@config';
import LandingPage from '@pages/landing';
import moment from 'moment';

const OrderIndexPage = () => {
  const { API_URL } = configs;

  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const { data, status, error } = useQuery<any>('orders', getOrders(userId));

  return (
    <Page noToolbar>
      <Navbar title="주문목록" backLink />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

      {data && (
        <List mediaList>
          {data.orders.map((order) => (
            <div className="mb-16">
              <b>{moment(order.created_at).format('YYYY-MM-DD')}</b>
              <span className="float-right">주문상세보기</span>
              {order.order_details.map((item) => (
                <List mediaList>
                  <ListItem
                    key={String(order.id) + String(item.item_id)}
                    link={`/items/${item.item_id}`}
                    title="상품명"
                    after={`${item.order_price} 원`}
                    subtitle={`${item.item_count} 개`}
                    text={item.item.description}
                  >
                    <img slot="media" src={`${API_URL}${item.item.image_path}`} width="80" />
                  </ListItem>
                </List>
              ))}
            </div>
          ))}
        </List>
      )}
    </Page>
  );
};

export default React.memo(OrderIndexPage);
