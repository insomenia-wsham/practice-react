import { logoutAPI } from '@api';
import CustomPanel from '@components/shared/CustomPanel';
import useAuth from '@hooks/useAuth';
import LandingPage from '@pages/landing';
import { destroyToken, getToken } from '@store';
import { sleep } from '@utils/index';
import { Link, Toolbar, View, Views } from 'framework7-react';
import React, { useCallback, useEffect, useState } from 'react';

const F7Views = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { currentUser, isAuthenticated, authenticateUser, unAuthenticateUser } = useAuth();

  const logoutHandler = useCallback(async () => {
    try {
      await logoutAPI();
    } catch (e) {
      console.log(e);
    } finally {
      unAuthenticateUser();
    }
  }, [unAuthenticateUser]);

  useEffect(() => {
    (async function checkToken() {
      try {
        // const response = await refresh();
        // saveToken(response.data);
        authenticateUser(getToken());
      } catch {
        destroyToken();
        unAuthenticateUser();
      } finally {
        await sleep(700);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <LandingPage />;
  }

  const loggedInViews = () => (
    <Views tabs className="safe-areas">
      <Toolbar tabbar labels bottom>
        <Link tabLink="#view-home" tabLinkActive icon="las la-home" text="홈" />
        <Link tabLink="#view-items" icon="las la-gift" text="상품" />
        <Link tabLink="#view-interests" icon="las la-heart" text="관심" />
        <Link tabLink="#view-carts" icon="las la-shopping-cart" text="장바구니" />
        <Link tabLink="#view-mypage" icon="las la-user" text="마이페이지" />
      </Toolbar>
      <View id="view-home" stackPages main tab tabActive url="/" iosDynamicNavbar={false} />
      <View id="view-items" stackPages name="items" tab url="/items?is_main=true/" />
      <View id="view-interests" stackPages name="interests" tab url="/interests?is_main=true" />
      <View id="view-carts" stackPages name="carts" tab url="/carts?is_main=true" />
      <View id="view-mypage" stackPages name="mypage" tab url="/mypage?is_main=true" />
    </Views>
  );

  const loggedOutViews = () => <View id="view-intro" main url="/intro" />;

  return (
    <>
      <CustomPanel handleLogout={logoutHandler} isLoggedIn={isAuthenticated} currentUser={currentUser} />
      {isAuthenticated ? loggedInViews() : loggedOutViews()}
    </>
  );
};

export default F7Views;
