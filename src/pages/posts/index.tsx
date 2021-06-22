import { getPosts } from '@api';
import { PageRouteProps, Post } from '@constants';
import { Navbar, Page, List, ListItem, Fab, Icon } from 'framework7-react';
import React from 'react';
import { useQuery } from 'react-query';

const PostIndexPage = ({ f7route, f7router }: PageRouteProps) => {
  const { data, status, error } = useQuery<Post[]>('posts', getPosts());

  return (
    <Page noToolbar>
      <Navbar title="게시글 목록" backLink />

      <Fab href="/posts/new" position="center-bottom" slot="fixed" text="게시글 작성" color="red">
        <Icon ios="f7:plus" aurora="f7:plus" md="material:add" />
      </Fab>

      {status === 'loading' && <div>Loading ....</div>}
      {status === 'error' && <div>{error}</div>}
      {data && (
        <List>
          {data.map((post) => (
            <ListItem
              link={`/posts/${post.id}`}
              key={post.id}
              title={post.title}
              after={post.user.email.split('@')[0]}
            />
          ))}
        </List>
      )}
    </Page>
  );
};

export default React.memo(PostIndexPage);
