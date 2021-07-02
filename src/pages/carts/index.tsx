import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getCarts, deleteCartItem, updateCartItem } from '@api';
import { f7, Navbar, Page, List, ListItem, Button, Block, Row, Col, Link, Segmented, Stepper } from 'framework7-react';
import { configs } from '@config';
import LandingPage from '@pages/landing';

const CartIndexPage = ({ f7route }) => {
  const { API_URL } = configs;
  const { is_main } = f7route.query;
  const { data, status, error } = useQuery<any>('carts', getCarts());
  const deleteCartMutation = useMutation(deleteCartItem());
  const updateCartMutation = useMutation(updateCartItem());
  const queryClient = useQueryClient();

  const handleItemCount = (id, value) => {
    updateCartMutation.mutate(
      { id, item_count: value },
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
    <Page>
      <Navbar title="장바구니 목록" backLink={!is_main} />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

      {data && data.carts.length > 0 ? (
        <List mediaList>
          {data.carts.map((cart) => (
            <ListItem key={cart.id}>
              <div>
                <div>
                  <div className="inline-block">
                    <Link href={`/items/${cart.item_id}`}>
                      <img slot="media" src={API_URL + cart.item.image_path} width="80" />
                    </Link>
                  </div>
                  <div className="inline-block w-2/3 float-right">
                    <div className="inline-block w-32 truncate">{cart.item.name}</div>
                    <div className="float-right ml-4 text-gray-400 text-sm">{`${(
                      cart.item_count * cart.item.sale_price
                    ).toLocaleString()} 원`}</div>
                    <div className="w-full h-6 text-xs text-gray-300 float-right truncate">{cart.item.description}</div>
                    <div className="px-4">
                      <Stepper
                        fill
                        className="pt-2"
                        min={1}
                        value={cart.item_count}
                        onStepperChange={(value) => handleItemCount(cart.id, value)}
                      />
                      <Block strong className="inline-block pl-10">
                        <i
                          className="la la-trash text-2xl"
                          onClick={() =>
                            deleteCartMutation.mutate(
                              {
                                id: cart.id,
                              },
                              {
                                onSuccess: () => {
                                  queryClient.invalidateQueries('carts');
                                },
                              },
                            )
                          }
                        />
                      </Block>
                    </div>
                  </div>
                </div>
              </div>
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
                      <Button fill raised className="m-5 py-6 mx-auto w-9/12 text-lg" type="submit">
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
