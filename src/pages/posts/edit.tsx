import { updatePost, getPost } from '@api';
import { PageRouteProps, Post } from '@constants';
import { Form, Formik } from 'formik';
import { f7, Navbar, Page, List, ListInput, Button } from 'framework7-react';
import React, { useEffect, useRef, useState } from 'react';
import PostForm from './PostForm';

interface PostEditPageProps extends PageRouteProps {
  setPost: React.Dispatch<React.SetStateAction<Post>>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostEditPage = ({ f7route, f7router, setPost, setPosts }: PostEditPageProps) => {
  const postId = f7route.params.id;
  const [post, setEditPost] = useState<Post>(null);

  useEffect(() => {
    (async () => {
      const { data } = await getPost(postId);
      await setEditPost(data);
    })();
  }, []);

  return (
    <Page noToolbar>
      <Navbar title="게시글 수정" backLink />

      <p className="p-3 text-base font-bold">게시글 수정</p>

      {post && <PostForm setPost={setPost} setPosts={setPosts} post={post} f7router={f7router} />}
    </Page>
  );
};

export default React.memo(PostEditPage);
