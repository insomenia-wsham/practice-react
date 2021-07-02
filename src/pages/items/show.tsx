import {
  API_URL,
  createCart,
  getItem,
  getReviews,
  createReview,
  deleteReview,
  deleteInterestItem,
  getInterestList,
  createInterestItem,
  getOrders,
} from '@api';
import { PageRouteProps } from '@constants';
import {
  f7,
  Navbar,
  Page,
  Row,
  Col,
  Button,
  Link,
  Stepper,
  Sheet,
  List,
  ListItem,
  Toolbar,
  PageContent,
} from 'framework7-react';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useAuth from '@hooks/useAuth';
import moment from 'moment';
import LandingPage from '@pages/landing';

const ItemShowPage = ({ f7route }: PageRouteProps) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const itemId = Number(f7route.params.id);
  const { data: item, status, error } = useQuery<any>(`items-${itemId}`, getItem(itemId));
  const { data: reviews } = useQuery<any>(`reviews-${itemId}`, getReviews(itemId));
  const { data: interestsData } = useQuery<any>('interest', getInterestList());
  const { data: ordersData } = useQuery<any>('orders', getOrders());
  const [itemCount, setItemCount] = useState(1);
  const [review, setReview] = useState<string>('');
  const createCartMutation = useMutation(createCart());

  const deleteInterestMutation = useMutation(deleteInterestItem());
  const createInterestMutation = useMutation(createInterestItem());

  const createReviewMutation = useMutation(createReview());
  const deleteReviewMutation = useMutation(deleteReview());
  const salePercent = (list_price: number, sale_price: number) => {
    const saleValue = list_price - sale_price;
    const lastValue = saleValue / list_price;

    return `${lastValue === 0 ? 0 : parseFloat((Number(lastValue) * 100).toFixed(1))}%`;
  };
  const handleItemCount = (value) => {
    setItemCount(value);
  };

  const handleReviewContent = (e) => {
    const { value } = e.target;
    setReview(value);
  };

  const handleCartCreate = async () => {
    if (itemCount > 0) {
      await createCartMutation.mutate(
        { item_id: itemId, item_count: itemCount },
        {
          onSuccess: (data) => {
            if (data.success) {
              // f7.dialog.alert('장바구니에 추가하였습니다.');
            } else {
              // f7.dialog.alert('이미 장바구니에 있는 상품입니다.');
            }
            queryClient.invalidateQueries('carts');
          },
        },
      );
    } else {
      f7.dialog.alert('1개 이상 선택 후 장바구니에 담아주세요.');
    }
  };

  const handleReviewDistroy = async (id, item_id) => {
    f7.dialog.confirm(
      '정말 삭제하시겠습니까?',
      'Practice React',
      () => {
        deleteReviewMutation.mutate(
          {
            id,
            item_id,
          },
          {
            onSuccess: () => {
              // f7.dialog.alert('성공적으로 삭제되었습니다. ');
              queryClient.invalidateQueries(`reviews-${itemId}`);
            },
          },
        );
      },
      () => {
        // f7.dialog.alert('취소되었습니다.');
      },
    );
  };

  return (
    <Page noToolbar pageContent={false}>
      <Navbar title="상품정보" backLink transparent />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

      <Toolbar bottom className="item-toolbar">
        {item && (
          <>
            <div className="px-4">
              {interestsData.interests.find((interest) => interest.item_id === item.id) ? (
                <i
                  className="mb-2 la la-heart text-4xl text-red-500"
                  onClick={() =>
                    deleteInterestMutation.mutate(
                      {
                        id: interestsData.interests.find((interest) => interest.item_id === item.id).id,
                      },
                      {
                        onSuccess: () => {
                          queryClient.invalidateQueries('interest');
                        },
                      },
                    )
                  }
                />
              ) : (
                <i
                  className="mb-2 la la-heart-o text-4xl text-gray-400 text-xl"
                  onClick={() =>
                    createInterestMutation.mutate(
                      {
                        item_id: item.id,
                      },
                      {
                        onSuccess: () => {
                          queryClient.invalidateQueries('interest');
                        },
                      },
                    )
                  }
                />
              )}
            </div>
            <Button fill className="w-full h-11 text-base mr-4" sheetOpen=".demo-sheet-swipe-to-step">
              구매하기
            </Button>
          </>
        )}
      </Toolbar>
      <PageContent className="pt-0">
        <div>
          <img src={item && API_URL + item.image_path} />
        </div>
        <div className="w-full">
          <div className="px-8 py-4">
            <h1 className="break-all text-lg font-bold leading-8">{item && item.name}</h1>
            <div className="my-2 truncate text-base font-normal text-gray-300">{item && item.description}</div>
            <div className="info-wrapper pb-6">
              <div className="price-constainer pb-4">
                <div className="price-upper">
                  <span className="mr-2 text-sm font-bold text-red-400">
                    {item && salePercent(item.list_price, item.sale_price)}
                  </span>
                  <span className="mr-2 text-sm font-bold text-gray-300">
                    <s>{item && item.list_price.toLocaleString()}</s>
                    <small>{item && '원'}</small>
                  </span>
                </div>
                <div className="price-bottom">
                  <span className="mr-2 text-sm font-bold text-xl">{item && item.sale_price.toLocaleString()}</span>
                  <small>{item && '원'}</small>
                </div>
              </div>
              <div id="one-time-section" className=" border border-solid border-gray-300 p-5">
                <div className="pt-4">
                  <dl id="item-quantity" className="w-8 float-left">
                    <dt className="w-8 text-sm">수량</dt>
                  </dl>
                  <Row className="margin-top">
                    <Col className="text-center">
                      <Stepper fill min={1} value={itemCount} onStepperChange={handleItemCount} />
                    </Col>
                  </Row>
                </div>
                <div className="resultPrice py-4">
                  <dl className="total pt-4 border-t border-solid border-gray-300">
                    <dt className="float-left">총 상품가</dt>
                    <dd className="text-right">
                      <strong>
                        <span id="totalSalesPrice">
                          {item && `${(item.sale_price * itemCount).toLocaleString()} 원`}
                        </span>
                      </strong>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="mb-8">
              <Row tag="p" className="mb-4">
                <b>배송 정보</b>
              </Row>
              <Row tag="p" className="mb-4">
                <span className="w-1/3">배송비</span>
                <span className="w-2/3 text-red-500">무료</span>
              </Row>
              <Row tag="p" className="mb-4">
                <span className="w-1/3">배송 지역</span>
                <span className="w-2/3">
                  국내 전 지역(제주/도서산간 배송불가) 오후 12시 이전 주문시 당일 출고(영업일 기준)
                </span>
              </Row>
              <Row tag="p" className="mb-4">
                <span className="w-1/3">발송 안내</span>
                <span className="w-2/3">주문 폭주 및 날씨 등 예외적인 상황의 경우 출고가 다소 지연될 수 있습니다.</span>
              </Row>
            </div>
          </div>
        </div>
        <Sheet className="demo-sheet-swipe-to-step h-auto" swipeToClose swipeToStep backdrop>
          <div className="sheet-modal-swipe-step">
            <List>
              <ListItem>
                <div className="p-4 w-full">
                  <p className="font-bold text-lg float-left">총 상품가격</p>
                  <p className="ml-4 float-right">{item && `${(item.sale_price * itemCount).toLocaleString()} 원`}</p>
                </div>
              </ListItem>
              <ListItem>
                <div className="p-4 w-full">
                  <p className="font-bold text-lg float-left">수량</p>
                  <p className="ml-4 float-right">
                    <Stepper fill min={1} value={itemCount} onStepperChange={handleItemCount} />
                  </p>
                </div>
              </ListItem>
            </List>
            <div className="flex w-full justify-around pb-8 px-2">
              <Button large raised className="w-1/2" onClick={handleCartCreate} sheetClose>
                장바구니 담기
              </Button>
              <Button large fill className="w-1/2" sheetClose>
                <Link
                  href={`/orders/new?item_id=${itemId}&item_count=${itemCount}&sale_price=${item && item.sale_price}`}
                >
                  바로 구매하기
                </Link>
              </Button>
            </div>
          </div>
        </Sheet>
        <div className="px-1 mt-4">
          {ordersData &&
          ordersData.orders.find((order) => {
            const orderListCheck = order.order_details.filter((itemInfo) => itemInfo.item_id === item?.id);
            if (orderListCheck.length > 0) {
              return true;
            }
            return false;
          }) ? (
            <div className="mb-10 px-4 py-4 bg-gray-50 rounded">
              <b>리뷰작성</b>
              <div className="mt-2">
                <textarea
                  className="inline-block p-2 w-2/3 h-28 bg-white"
                  onChange={handleReviewContent}
                  value={review}
                />
                <input
                  type="button"
                  className="inline-block w-1/4 h-28 float-right rounded-lg bg-gray-100"
                  value="등록"
                  onClick={() =>
                    createReviewMutation.mutate(
                      { item_id: itemId, content: review },
                      {
                        onSuccess: () => {
                          queryClient.invalidateQueries(`reviews-${itemId}`);
                          setReview('');
                        },
                      },
                    )
                  }
                />
              </div>
            </div>
          ) : null}

          {reviews && reviews.total_count > 0 ? (
            <div>
              <div className="py-4 pl-4 border-t border-b bg-gray-50">
                <p>{`총 댓글(${reviews.total_count})`}</p>
              </div>
              <ul className="list-none">
                {reviews.reviews.map((info) => (
                  <li key={info.id} className="p-4 border-b">
                    <div className="mb-4">
                      <span>
                        <b>{info.user.name}</b>
                      </span>
                      <span className="ml-4 text-xs text-gray-400">
                        {moment(info.created_at).format('YYYY-MM-DD HH:mm:ss')}
                      </span>
                      {info.user.id === userId ? (
                        <div className="float-right" onClick={() => handleReviewDistroy(info.id, info.item_id)}>
                          <span className="text-red-500">삭제</span>
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <span>{info.content}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </PageContent>
    </Page>
  );
};

export default ItemShowPage;
