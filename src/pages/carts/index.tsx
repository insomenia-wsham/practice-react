import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getCarts, deleteCartItem, updateCartItem } from '@api';
import { f7, Navbar, Page, List, ListItem, Button, Block, Row, Col, Link, Segmented } from 'framework7-react';
import { configs } from '@config';
import LandingPage from '@pages/landing';

const CartIndexPage = () => {
  const { API_URL } = configs;
  const { data, status, error } = useQuery<any>('carts', getCarts());
  const deleteCartMutation = useMutation(deleteCartItem());
  const updateCartMutation = useMutation(updateCartItem());
  const queryClient = useQueryClient();

  const handleItemCount = (mode: string, id: number, value: number) => {
    let newItemCount = value;
    if (mode === 'decrease') {
      if (value > 1) {
        newItemCount = value - 1;
      } else {
        f7.dialog.alert('삭제하기를 이용해주세요.');
      }
    } else if (mode === 'increase') {
      newItemCount = value + 1;
    }
    updateCartMutation.mutate(
      { id, item_count: newItemCount },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('carts');
        },
      },
    );
  };

  const totalPrice = (carts: any[] = []) => {
    let price = 0;
    for (const info of carts) {
      price += info.item_count * info.item.sale_price;
    }
    return price.toLocaleString();
  };

  return (
    <Page noToolbar>
      <Navbar title="장바구니 목록" backLink />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

      {data && data.carts.length > 0 ? (
        <List mediaList>
          {data.carts.map((cart) => (
            <ListItem
              key={cart.id}
              title={cart.item.name}
              after={`${(cart.item_count * cart.item.sale_price).toLocaleString()} 원`}
              text={cart.item.description}
            >
              <img slot="media" src={API_URL + cart.item.image_path} width="80" />
              <dd className="py-4 text-center">
                <span className="quantity">
                  <button
                    className="decrease w-20"
                    onClick={() => handleItemCount('decrease', cart.id, cart.item_count)}
                  >
                    -
                  </button>
                  <span className="count">{cart.item_count}</span>
                  <button
                    className="increase w-20"
                    onClick={() => handleItemCount('increase', cart.id, cart.item_count)}
                  >
                    +
                  </button>
                </span>
              </dd>
              <Block strong>
                <Segmented raised tag="p">
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
                  <Button>
                    <Link href={`/items/${cart.item_id}`}>바로가기</Link>
                  </Button>
                </Segmented>
              </Block>
            </ListItem>
          ))}
          {data.carts.length > 0 ? (
            <List>
              <ListItem title="총 결제 예상 금액">
                <span className="float-right">{`${totalPrice(data.carts)} 원`}</span>
              </ListItem>
              <ListItem>
                <Block strong>
                  <Row>
                    <Col>
                      <Button fill raised className="m-5 py-6 mx-auto w-9/12" type="submit">
                        <Link href="/orders/new">주문하기</Link>
                      </Button>
                    </Col>
                  </Row>
                </Block>
              </ListItem>
            </List>
          ) : null}
        </List>
      ) : (
        <div className="pt-48">
          <p className="text-center">
            <b>장바구니가 비어있습니다.</b>
          </p>
        </div>
      )}
    </Page>
  );
};

export default React.memo(CartIndexPage);
