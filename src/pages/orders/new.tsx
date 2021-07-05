import React, { useState } from 'react';
import { getCarts, createOrder } from '@api';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, Navbar, Page, List, ListInput, Button } from 'framework7-react';
import { useQuery, useQueryClient } from 'react-query';
import useAuth from '@hooks/useAuth';
import useUser from '@hooks/useUser';
import * as Yup from 'yup';
import { sleep } from '@utils';
import LandingPage from '@pages/landing';
import DaumPostcode from 'react-daum-postcode';

interface ReceiverInfo {
  receiver_zipcode: string;
  receiver_address: string;
  receiver_address_detail: string;
  receiver_name: string;
}

const OrderCreateSchema = Yup.object().shape({
  receiver_name: Yup.string().required('필수 입력사항 입니다.'),
  receiver_address: Yup.string().required('필수 입력사항 입니다.'),
  receiver_address_detail: Yup.string().required('필수 입력사항 입니다.'),
  receiver_zipcode: Yup.string().required('필수 입력사항 입니다.'),
});

const OrderNewPage = ({ f7route, f7router }) => {
  const { currentUserInfo } = useUser();
  const { currentUser } = useAuth();
  const userId: number = currentUser.id;
  const { data, status, error, refetch } = useQuery<any>('carts', getCarts());
  const queryClient = useQueryClient();
  const [isAddress, setIsAddress] = useState('');
  const [isZoneCode, setIsZoneCode] = useState();
  const [isPostOpen, setIsPostOpen] = useState(false);
  const initialValues: ReceiverInfo = {
    receiver_zipcode: isZoneCode,
    receiver_address: isAddress,
    receiver_address_detail: '',
    receiver_name: currentUserInfo.name,
  };

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }
    setIsZoneCode(data.zonecode);
    setIsAddress(fullAddress);
    setIsPostOpen(false);
  };
  return (
    <Page noToolbar>
      <Navbar title="주문서 작성하기" backLink />

      {status === 'loading' && <LandingPage />}
      {status === 'error' && <div>{error}</div>}
      {isPostOpen ? <DaumPostcode height={620} onComplete={handleComplete} /> : null}
      {data && !isPostOpen ? (
        <Formik
          initialValues={initialValues}
          validationSchema={OrderCreateSchema}
          onSubmit={async (values, { setSubmitting }: FormikHelpers<ReceiverInfo>) => {
            await sleep(400);
            f7.dialog.preloader('잠시만 기다려주세요...');
            try {
              if (data.carts.length > 0 || f7route.query.item_id) {
                await createOrder({
                  ...values,
                  user_id: userId,
                  item_list: f7route.query.item_id
                    ? [
                        {
                          item_id: f7route.query.item_id,
                          item_count: f7route.query.item_count,
                          item: { sale_price: f7route.query.sale_price },
                        },
                      ]
                    : data.carts,
                  direct: f7route.query.item_id > 0,
                });
              } else {
                f7router.back();
              }
              if (!f7route.query.item_id) {
                await queryClient.invalidateQueries('carts');
              }
            } catch (e) {
              throw new Error(e);
            } finally {
              const toastCenter = f7.toast.create({
                text: '결제완료하였습니다.',
                position: 'center',
                closeTimeout: 2000,
              });
              setSubmitting(false);
              f7.dialog.close();
              toastCenter.open();
              f7router.back();
            }
          }}
          validateOnMount
        >
          {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
            <Form>
              <List noHairlinesMd className="px-6">
                <ListInput
                  label="수령자"
                  type="text"
                  name="receiver_name"
                  placeholder="수령자 이름을 입력해주세요."
                  clearButton
                  value={values.receiver_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ListInput
                  label="배송주소"
                  type="text"
                  name="receiver_address"
                  placeholder="배송지 주소를 입력해주세요."
                  clearButton
                  value={isAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={() => setIsPostOpen(true)}
                />
                <ListInput
                  label="상세주소"
                  type="text"
                  name="receiver_address_detail"
                  placeholder="상세주소를 입력해주세요."
                  clearButton
                  value={values.receiver_address_detail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ListInput
                  label="우편번호"
                  type="text"
                  name="receiver_zipcode"
                  placeholder="우편번호를 입력해주세요."
                  clearButton
                  value={isZoneCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Button fill className="mt-10 h-11" type="submit" disabled={isSubmitting || !isValid}>
                  결제하기
                </Button>
              </List>
            </Form>
          )}
        </Formik>
      ) : null}
    </Page>
  );
};

export default React.memo(OrderNewPage);
