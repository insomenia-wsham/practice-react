import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getCarts, deleteCartItem, updateCartItem } from '@api';
import { f7, Navbar, Page, List, ListItem, Button, Block, Row, Col, Link } from 'framework7-react';
import { configs } from '@config';
import LandingPage from '@pages/landing';

const CartIndexPage = () => {
  const { API_URL } = configs;
  const { data, status, error } = useQuery<any>('carts', getCarts());
  const deleteCartMutation = useMutation(deleteCartItem());
  const updateCartMutation = useMutation(updateCartItem());
  const queryClient = useQueryClient();

  const decreaseClick = (id, item_count) => {
    if (item_count > 1) {
      const decreaseCount = item_count - 1;
      updateCartMutation.mutate(
        { id, item_count: decreaseCount },
        {
          onSuccess: () => {
            queryClient.invalidateQueries('carts');
          },
        },
      );
    } else {
      f7.dialog.alert('삭제하기를 이용해주세요.');
    }
  };

  const increaseClick = (id, item_count) => {
    const decreaseCount = item_count + 1;
    updateCartMutation.mutate(
      { id, item_count: decreaseCount },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('carts');
        },
      },
    );
  };

  const totalPrice = (carts = []) => {
    let price = 0;
    for (const info of carts) {
      price += info.item_count * info.item.sale_price;
    }
    return price;
  };

  return (
    <Page noToolbar>
      <Navbar title="장바구니 목록" backLink />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

      {data && (
        <List mediaList>
          {data.carts.map((cart) => (
            <ListItem
              key={cart.id}
              title={cart.item.name}
              after={`${cart.item_count * cart.item.sale_price} 원`}
              text={cart.item.description}
            >
              <img slot="media" src={API_URL + cart.item.image_path} width="80" />
              <dd className="py-4 text-center">
                <span className="quantity">
                  <button className="decrease w-20" onClick={() => decreaseClick(cart.id, cart.item_count)}>
                    -
                  </button>
                  <span className="count">{cart.item_count}</span>
                  <button className="increase w-20" onClick={() => increaseClick(cart.id, cart.item_count)}>
                    +
                  </button>
                </span>
              </dd>
              <Button
                fill
                onClick={() =>
                  deleteCartMutation.mutate(
                    {
                      id: cart.id,
                    },
                    {
                      onSuccess: () => {
                        f7.dialog.alert('성공적으로 삭제되었습니다. ');
                        queryClient.invalidateQueries('carts');
                      },
                    },
                  )
                }
              >
                삭제하기
              </Button>
            </ListItem>
          ))}
          {data.carts.length > 0 ? (
            <List>
              <ListItem title={`총 결제 예상 금액: ${totalPrice(data.carts)} 원`} />
              <ListItem>
                <Block strong>
                  <Row>
                    <Col>
                      <Button raised className="m-5 mx-auto w-6/12" type="submit">
                        <Link href="/orders/new">주문하기</Link>
                      </Button>
                    </Col>
                  </Row>
                </Block>
              </ListItem>
            </List>
          ) : null}
        </List>
      )}
    </Page>
  );
};

export default React.memo(CartIndexPage);
