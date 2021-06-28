import { getOrders } from '@api';
import { Navbar, Page, List, ListItem } from 'framework7-react';
import React from 'react';
import { useQuery } from 'react-query';
import { configs } from '@config';
import LandingPage from '@pages/landing';
import moment from 'moment';

const OrderIndexPage = () => {
  const { API_URL } = configs;
  const { data, status, error } = useQuery<any>('orders', getOrders());

  return (
    <Page noToolbar>
      <Navbar title="주문목록" backLink />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

      {data && data.orders.length > 0 ? (
        <List mediaList className="px-4">
          {data.orders.map((order) => (
            <div key={order.id} className="mb-16">
              <b>{moment(order.created_at).format('YYYY-MM-DD')}</b>
              <span className="float-right">주문상세보기</span>
              {order.order_details.map((item) => (
                <List mediaList>
                  <ListItem
                    key={item.id}
                    link={`/items/${item.item_id}`}
                    title="상품명"
                    after={`${item.order_price ? item.order_price.toLocaleString() : null} 원`}
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
      ) : (
        <div className="pt-48">
          <p className="text-center">
            <b>주문하신 상품이 없습니다.</b>
          </p>
        </div>
      )}
    </Page>
  );
};

export default React.memo(OrderIndexPage);
