import { getInterestList, deleteInterestItem } from '@api';
import { f7, Navbar, Page, List, ListItem } from 'framework7-react';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { configs } from '@config';
import LandingPage from '@pages/landing';

const InterestIndexPage = ({ f7route }) => {
  const { API_URL } = configs;
  const { is_main } = f7route.query;
  const { data, status, error } = useQuery<any>('interest', getInterestList());
  const deleteInterestMutation = useMutation(deleteInterestItem());
  const queryClient = useQueryClient();
  const toastCenter = f7.toast.create({
    text: '삭제되었습니다.',
    position: 'center',
    closeTimeout: 1000,
  });

  return (
    <Page noToolbar={!is_main}>
      <Navbar title="관심 목록" backLink={!is_main} />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}

      {data && data.interests && data.interests.length > 0 ? (
        <List mediaList>
          {data.interests.map((interest) => (
            <ListItem
              key={interest.id}
              title={interest.item.name}
              after={`${interest.item.sale_price.toLocaleString()} 원`}
              text={interest.item.description}
            >
              <img slot="media" src={API_URL + interest.item.image_path} width="80" />
              <div className="text-center">
                <i
                  className="la la-trash pt-1 text-2xl"
                  onClick={() =>
                    deleteInterestMutation.mutate(
                      {
                        id: interest.id,
                      },
                      {
                        onSuccess: () => {
                          queryClient.invalidateQueries('interest');
                          toastCenter.open();
                        },
                      },
                    )
                  }
                />
              </div>
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
