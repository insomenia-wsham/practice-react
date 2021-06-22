import { getInterestList, deleteInterestItem } from '@api';
import { f7, Navbar, Page, List, ListItem, Button, Block, Link, Segmented } from 'framework7-react';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useAuth from '@hooks/useAuth';
import { configs } from '@config';
import LandingPage from '@pages/landing';

const InterestIndexPage = () => {
  const { API_URL } = configs;

  const { authenticateUser, currentUser } = useAuth();
  const userId = currentUser.id;
  const { data, status, error } = useQuery<any>('interest', getInterestList(userId));
  const deleteInterestMutation = useMutation(deleteInterestItem());
  const queryClient = useQueryClient();

  return (
    <Page noToolbar>
      <Navbar title="관심 목록" backLink />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

      {data && (
        <List mediaList>
          {data.interests.map((interest) => (
            <ListItem
              key={interest.id}
              title={interest.item.name}
              after={`${interest.item.sale_price} 원`}
              text={interest.item.description}
            >
              <img slot="media" src={API_URL + interest.item.image_path} width="80" />
              <Block strong>
                <Segmented raised tag="p">
                  <Button
                    fill
                    onClick={() =>
                      deleteInterestMutation.mutate(
                        {
                          userId,
                          id: interest.id,
                        },
                        {
                          onSuccess: () => {
                            f7.dialog.alert('성공적으로 삭제되었습니다. ');
                            queryClient.invalidateQueries('interest');
                          },
                        },
                      )
                    }
                  >
                    삭제하기
                  </Button>
                  <Button>
                    <Link href={`/items/${interest.item_id}`}>바로가기</Link>
                  </Button>
                </Segmented>
              </Block>
            </ListItem>
          ))}
        </List>
      )}
    </Page>
  );
};

export default React.memo(InterestIndexPage);
