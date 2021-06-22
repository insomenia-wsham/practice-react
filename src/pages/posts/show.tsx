import { destroyPost, getPost } from '@api';
import { PageRouteProps, Post } from '@constants';
import { f7, Navbar, NavRight, Page, Link } from 'framework7-react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

interface PostShowPageProps extends PageRouteProps {
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}

const PostShowPage = ({ f7route, f7router, setPosts }: PostShowPageProps) => {
  const postId = f7route.params.id;
  const { data: post, status, error } = useQuery<Post>(`posts-${postId}`, getPost(postId));

  return (
    <Page noToolbar>
      <Navbar title={post?.title} backLink>
        <NavRight>
          <Link
            iconF7="ellipsis"
            onClick={() => {
              f7.dialog
                .create({
                  title: '메뉴',
                  buttons: [
                    {
                      text: '게시글 수정',
                      onClick: () => {
                        f7router.navigate(`/posts/${post.id}/edit`);
                      },
                    },
                    {
                      text: '게시글 삭제',
                      onClick: async () => {
                        f7.dialog.preloader('게시글 삭제중...');
                        try {
                          const { data } = await destroyPost(post.id);
                          if (data) {
                            setPosts((posts) => posts.filter((p) => p.id !== post.id));
                            f7router.back();
                          }
                        } catch (e) {
                          throw new Error(e);
                        } finally {
                          f7.dialog.close();
                        }
                      },
                    },
                  ],
                  verticalButtons: true,
                })
                .open();
            }}
          />
        </NavRight>
      </Navbar>

      <div className="p-3">
        <h1 className="text-xl font-bold">{post?.title}</h1>
        <p className="mt-3">{post?.content}</p>
      </div>
    </Page>
  );
};

export default React.memo(PostShowPage);
