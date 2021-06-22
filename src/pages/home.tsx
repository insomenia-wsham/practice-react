import Categories from '@components/Categories';
import { Link, Navbar, NavLeft, NavRight, NavTitle, Page, Swiper, SwiperSlide } from 'framework7-react';
import React from 'react';
import { useQuery } from 'react-query';
import useAuth from '@hooks/useAuth';
import { getCarts } from '@api';
import img1 from '../assets/images/4.png';
import img2 from '../assets/images/5.png';
import img3 from '../assets/images/6.png';

const HomePage = () => {
  const { authenticateUser, currentUser } = useAuth();
  const userId = currentUser.id;
  const { data, status, error } = useQuery<any>('carts', getCarts(userId));
  return (
    <Page name="home">
      <Navbar>
        <NavLeft>
          <Link icon="las la-bars" panelOpen="left" />
        </NavLeft>
        <NavTitle>인썸니아</NavTitle>
        <NavRight>
          <Link href="/carts" iconF7="cart" iconBadge={data ? data.total_count : 0} badgeColor="red" />
        </NavRight>
      </Navbar>
      <div
        data-pagination='{"el": ".swiper-pagination"}'
        data-space-between="50"
        className="swiper-container swiper-init demo-swiper h-48"
      >
        <div className="swiper-pagination" />
        <div className="swiper-wrapper">
          <div className="swiper-slide box-border border-gray-100 text-sm font-light flex justify-center items-center">
            <img src={img1} />
          </div>
          <div className="swiper-slide box-border border-gray-100 text-sm font-light flex justify-center items-center">
            <img src={img2} />
          </div>
          <div className="swiper-slide box-border border-gray-100 text-sm font-light flex justify-center items-center">
            <img src={img3} />
          </div>
        </div>
      </div>
      <div />
      <Categories />
    </Page>
  );
};
export default React.memo(HomePage);
