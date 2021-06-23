import React from 'react';
import { getCarts, createOrder } from '@api';
import { f7, Navbar, Page, List, ListInput, Button, Link } from 'framework7-react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useAuth from '@hooks/useAuth';

interface ReceiverInfo {
  receiver_zipcode: string;
  receiver_address: string;
  receiver_address_detail: string;
  receiver_name: string;
}

const OrderNewPage = () => {
  const { currentUser } = useAuth();
  const userId: string = currentUser.id;
  const [receiverInfo, setReceiverInfo] = React.useState<ReceiverInfo>({
    receiver_zipcode: '',
    receiver_address: '',
    receiver_address_detail: '',
    receiver_name: '',
  });
  const { data, status, error, refetch } = useQuery<any>('carts', getCarts());
  const queryClient = useQueryClient();
  const createOrderAPI = async () => {
    createOrder({
      user_id: userId,
      item_list: data.carts,
      receiver_zipcode: receiverInfo.receiver_zipcode,
      receiver_address: receiverInfo.receiver_address,
      receiver_address_detail: receiverInfo.receiver_address_detail,
      receiver_name: receiverInfo.receiver_name,
    });
    await queryClient.removeQueries('carts');
    await refetch();
    f7.dialog.alert('결재가 완료되었습니다.');
  };

  const onChangeReceiverInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'name':
        setReceiverInfo({
          ...receiverInfo,
          receiver_name: e.target.value,
        });
        break;
      case 'address':
        setReceiverInfo({
          ...receiverInfo,
          receiver_address: e.target.value,
        });
        break;
      case 'addressDetail':
        setReceiverInfo({
          ...receiverInfo,
          receiver_address_detail: e.target.value,
        });
        break;
      case 'zipcode':
        setReceiverInfo({
          ...receiverInfo,
          receiver_zipcode: e.target.value,
        });
        break;
    }
  };

  return (
    <Page noToolbar>
      <Navbar title="주문서 작성하기" backLink />
      <List noHairlinesMd>
        <ListInput
          label="수령자"
          type="text"
          name="name"
          placeholder="수령자 이름을 입력해주세요."
          clearButton
          onChange={onChangeReceiverInfo}
        />
        <ListInput
          label="배송주소"
          type="text"
          name="address"
          placeholder="배송지 주소를 입력해주세요."
          clearButton
          onChange={onChangeReceiverInfo}
        />
        <ListInput
          label="상세주소"
          type="text"
          name="addressDetail"
          placeholder="상세주소를 입력해주세요."
          clearButton
          onChange={onChangeReceiverInfo}
        />
        <ListInput
          label="우편번호"
          type="text"
          name="zipcode"
          placeholder="우편번호를 입력해주세요."
          clearButton
          onChange={onChangeReceiverInfo}
        />
        <Button fill onClick={createOrderAPI}>
          <Link href="/">결재하기</Link>
        </Button>
      </List>
    </Page>
  );
};

export default React.memo(OrderNewPage);
