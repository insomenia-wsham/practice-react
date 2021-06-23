import { API_URL, createCart, getItem, createInterest, getReviews, createReview } from '@api';
import { PageRouteProps } from '@constants';
import { Link, f7, Navbar, Page, Swiper, SwiperSlide, Block, Row, Col, Button } from 'framework7-react';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useAuth from '@hooks/useAuth';
import moment from 'moment';

const ItemShowPage = ({ f7route }: PageRouteProps) => {
  const { authenticateUser, currentUser } = useAuth();
  const userId = currentUser.id;
  const itemId = f7route.params.id;
  const { data: item, status, error } = useQuery<any>(`items-${itemId}`, getItem(itemId));
  const {
    data: reviews,
    status: reviewsStatus,
    error: reviewsError,
  } = useQuery<any>(`reviews-${itemId}`, getReviews(itemId));
  const [itemCount, setItemCount] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  const createCartMutation = useMutation(createCart());
  const createReviewMutation = useMutation(createReview());
  const queryClient = useQueryClient();
  const salePercent = (list_price, sale_price) => {
    const saleValue = list_price - sale_price;
    const lastValue = saleValue / list_price;

    return `${lastValue * 100}%`;
  };
  const decreaseClick = () => {
    const decreaseCount = itemCount > 0 ? itemCount - 1 : 0;
    setItemCount(decreaseCount);
  };

  const increaseClick = () => {
    const increaseCount = itemCount + 1;
    setItemCount(increaseCount);
  };

  const onChageReviewContent = (e) => {
    setReviewContent(e.target.value);
  };

  const cartCreateAPI = async () => {
    if (itemCount > 0) {
      await createCartMutation.mutate(
        { user_id: userId, item_id: itemId, item_count: itemCount },
        {
          onSuccess: (data) => {
            f7.dialog.alert(data.message);
            queryClient.invalidateQueries('carts');
          },
        },
      );
    } else {
      f7.dialog.alert('1개 이상 선택 후 장바구니에 담아주세요.');
    }
  };

  const interestCreateAPI = async () => {
    await createInterest({ user_id: userId, item_id: Number(itemId) }, (data) => {
      f7.dialog.alert(data.message);
    });
  };

  return (
    <Page noToolbar>
      <Navbar title="상품상세" backLink />
      <Swiper pagination navigation scrollbar>
        <SwiperSlide>
          <img
            slot="media"
            alt=""
            src={item && API_URL + item.image_path}
            className="w-full m-auto radius rounded shadow"
          />
        </SwiperSlide>
      </Swiper>
      <div className="w-full">
        <div className="px-8 py-12">
          <h1 className="mb-2 break-all text-lg font-bold leading-8">{item && item.name}</h1>
          <h2 className="mt-5 mb-8 break-all text-base font-normal text-gray-300">{item && item.description}</h2>
          <div className="info-wrapper pb-6">
            <div className="price-constainer pb-4">
              <div className="price-upper">
                <span className="mr-2 text-sm font-bold text-red-400">
                  {item && salePercent(item.list_price, item.sale_price)}
                </span>
                <span className="mr-2 text-sm font-bold text-gray-300">
                  <s>{item && item.list_price}</s>
                  <small>{item && '원'}</small>
                </span>
              </div>
              <div className="price-bottom">
                <span className="mr-2 text-sm font-bold text-xl">{item && item.sale_price}</span>
                <small>{item && '원'}</small>
              </div>
            </div>
            <div id="one-time-section" className=" border border-solid border-gray-300 p-5">
              <div className="pt-4">
                <dl id="item-quantity" className="w-8 float-left">
                  <dt className="w-8 text-sm">수량</dt>
                </dl>
                <dd className="pl-8">
                  <span className="quantity">
                    <button className="decrease w-28" onClick={decreaseClick}>
                      -
                    </button>
                    <span className="count">{itemCount}</span>
                    <button className="increase float-right w-24" onClick={increaseClick}>
                      +
                    </button>
                  </span>
                </dd>
              </div>
              <div className="resultPrice py-4">
                <dl className="total pt-4 border-t border-solid border-gray-300">
                  <dt className="float-left">총 상품가</dt>
                  <dd className="text-right">
                    <strong>
                      <span id="totalSalesPrice">{item && `${item.sale_price * itemCount} 원`}</span>
                    </strong>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <Block strong>
            <Row tag="p" className="mb-4">
              <Col tag="span">
                <Button raised onClick={cartCreateAPI}>
                  장바구니 담기
                </Button>
              </Col>
              <Col tag="span">
                <Button raised fill onClick={interestCreateAPI}>
                  관심목록 추가
                </Button>
              </Col>
            </Row>
            <Row tag="p">
              <Col tag="span">
                <Button raised fill onClick={() => f7.dialog.alert('개발 진행중입니다.')}>
                  {/* <Link
                    href="/orders/new"
                    routeProps={{
                      item_id: itemId,
                      item_count: itemCount,
                      direct: true,
                    }}
                  > */}
                  바로 구매하기
                  {/* </Link> */}
                </Button>
              </Col>
            </Row>
          </Block>
        </div>
      </div>
      <div className="px-1 mt-4">
        <div className="mb-10 px-4 py-4 bg-gray-50 rounded">
          <b>리뷰작성</b>
          <div className="mt-2">
            <textarea
              className="inline-block p-2 w-2/3 h-28 bg-white"
              onChange={onChageReviewContent}
              value={reviewContent}
            />
            <input
              type="button"
              className="inline-block w-1/4 h-28 float-right rounded-lg bg-gray-100"
              value="등록"
              onClick={() =>
                createReviewMutation.mutate(
                  { user_id: userId, item_id: itemId, content: reviewContent },
                  {
                    onSuccess: () => {
                      f7.dialog.alert('성공적으로 리뷰가 작성되었습니다. ');
                      queryClient.invalidateQueries(`reviews-${itemId}`);
                      setReviewContent('');
                    },
                  },
                )
              }
            />
          </div>
        </div>
        {reviews ? (
          <div>
            <div className="py-4 pl-4 border-t border-b bg-gray-50">
              <p>{`총 댓글(${reviews.total_count})`}</p>
            </div>
            <ul className="list-none">
              {reviews.reviews.map((review) => (
                <li className="p-4 border-b">
                  <div className="mb-4">
                    <span>
                      <b>{review.user.name}</b>
                    </span>
                    <span className="ml-4 text-xs text-gray-400">
                      {moment(review.create_at).format('YYYY-MM-DD HH:MM:SS')}
                    </span>
                  </div>
                  <div>
                    <span>{review.content}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Page>
  );
};

export default ItemShowPage;
