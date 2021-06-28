import { createPost } from '@api';
import { PageRouteProps, Post } from '@constants';
import { Form, Formik } from 'formik';
import { f7, Navbar, Page, List, ListInput, Button } from 'framework7-react';
import React from 'react';
import * as Yup from 'yup';
import PostForm from './PostForm';

interface PostNewPageProps extends PageRouteProps {
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostNewPage = ({ f7route, f7router, setPosts }: PostNewPageProps) => (
  <Page noToolbar>
    <Navbar title="게시글 작성" backLink />

    <p className="p-3 text-base font-bold">게시글 작성</p>

    <PostForm f7router={f7router} setPosts={setPosts} />
  </Page>
);

export default React.memo(PostNewPage);
