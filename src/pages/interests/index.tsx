import { getInterestList, deleteInterestItem } from '@api';
import { f7, Navbar, Page, List, ListItem, Button, Block, Link, Segmented } from 'framework7-react';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { configs } from '@config';
import LandingPage from '@pages/landing';

const InterestIndexPage = () => {
  const { API_URL } = configs;

  const { data, status, error } = useQuery<any>('interest', getInterestList());
  const deleteInterestMutation = useMutation(deleteInterestItem());
  const queryClient = useQueryClient();

  return (
    <Page noToolbar>
      <Navbar title="관심 목록" backLink />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

      {data && data.interests.length > 0 ? (
        <List mediaList>
          {data.interests.map((interest) => (
            <ListItem
              key={interest.id}
              title={interest.item.name}
              after={`${interest.item.sale_price.toLocaleString()} 원`}
              text={interest.item.description}
            >
              <img slot="media" src={API_URL + interest.item.image_path} width="80" />
              <Block strong className="mt-6">
                <Segmented raised tag="p">
                  <Button
                    fill
                    onClick={() =>
                      deleteInterestMutation.mutate(
                        {
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
      ) : (
        <div className="pt-48">
          <p className="text-center">
            <b>관심목록이 비어있습니다.</b>
          </p>
        </div>
      )}
    </Page>
  );
};

export default React.memo(InterestIndexPage);
