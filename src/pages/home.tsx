import Categories from '@components/Categories';
import { Link, Navbar, NavLeft, NavRight, NavTitle, Page, Swiper, SwiperSlide } from 'framework7-react';
import React, { useEffect } from 'react';
import useUser from '@hooks/useUser';
import useAuth from '@hooks/useAuth';
import img1 from '../assets/images/1.jpg';
import img2 from '../assets/images/2.jpeg';
import img3 from '../assets/images/3.jpg';
import img4 from '../assets/images/4.jpg';
import ItemList from './items/ItemList';

const HomePage = () => {
  const { handleUpdateUser } = useUser();
  const { currentUser } = useAuth();
  const { id, email, name } = currentUser;

  useEffect(() => {
    handleUpdateUser({ id, email, name });
  }, []);

  return (
    <Page name="home">
      <Navbar>
        <NavTitle>MARKETQ</NavTitle>
      </Navbar>
      <div className="p-2">
        <a className="pl-1 pr-2">베스트</a>
        <a className="pr-2">기획전</a>
        <a className="pr-2">
          <span className="text-red-500">온리</span>마켓큐
        </a>
        <a className="pr-2">클리어런스</a>
        <a className="pr-2">리퍼브</a>
        <a className="pr-2">소상공인</a>
        <a>캠핑</a>
      </div>

      <div
        data-pagination='{"el": ".swiper-pagination"}'
        data-space-between="50"
        className="swiper-container swiper-init demo-swiper h-auto"
      >
        <div className="swiper-pagination" />
        <div className="swiper-wrapper">
          <div className="swiper-slide box-border border-gray-100 text-sm font-light flex justify-center items-center">
            <img src={img3} />
          </div>
          <div className="swiper-slide box-border border-gray-100 text-sm font-light flex justify-center items-center">
            <img src={img4} />
          </div>
        </div>
      </div>
      <div />
      <Categories />
      <ItemList />
      <div />
      <div data-space-between="50" className="swiper-container swiper-init demo-swiper h-auto mb-2">
        <div className="swiper-pagination" />
        <div className="swiper-wrapper">
          <div className="swiper-slide box-border border-gray-100 text-sm font-light flex justify-center items-center">
            <img src={img1} />
          </div>
          <div className="swiper-slide box-border border-gray-100 text-sm font-light flex justify-center items-center">
            <img src={img2} />
          </div>
        </div>
      </div>
      <div />
    </Page>
  );
};
export default React.memo(HomePage);
