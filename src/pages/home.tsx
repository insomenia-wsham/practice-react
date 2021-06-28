import Categories from '@components/Categories';
import { Link, Navbar, NavLeft, NavRight, NavTitle, Page, Swiper, SwiperSlide } from 'framework7-react';
import React, { useEffect } from 'react';
import useUser from '@hooks/useUser';
import useAuth from '@hooks/useAuth';
import img1 from '../assets/images/4.png';
import img2 from '../assets/images/5.png';
import img3 from '../assets/images/6.png';

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
        <NavLeft>
          <Link icon="las la-bars" panelOpen="left" />
        </NavLeft>
        <NavTitle>Insomenia</NavTitle>
        <NavRight>
          {/* <Link href="/carts" iconF7="cart" badgeColor="red" /> */}
          <Link href="/carts" iconF7="search" badgeColor="red" />
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
