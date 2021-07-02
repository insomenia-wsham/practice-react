import { signupAPI } from '@api';
import useAuth from '@hooks/useAuth';
import { sleep } from '@utils';
import { Form, Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Page, Button } from 'framework7-react';
import React from 'react';
import * as Yup from 'yup';
import i18n from '../../../assets/lang/i18n';

interface FormValues {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항 입니다'),
  email: Yup.string().email().required('필수 입력사항 입니다'),
  password: Yup.string().min(4, '길이가 너무 짧습니다').max(50, '길이가 너무 깁니다').required('필수 입력사항 입니다'),
  password_confirmation: Yup.string()
    .min(4, '길이가 너무 짧습니다')
    .max(50, '길이가 너무 깁니다')
    .required('필수 입력사항 입니다'),
});

const SignUpPage = () => {
  const { authenticateUser } = useAuth();
  const initialValues: FormValues = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  };

  return (
    <Page className="px-4">
      <p className="font-semibole text-2xl text-center mt-12">MARKETQ</p>
      <Formik
        initialValues={initialValues}
        validationSchema={SignUpSchema}
        onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
          await sleep(400);
          setSubmitting(false);
          f7.dialog.preloader('잠시만 기다려주세요...');
          try {
            const { data: user } = await signupAPI({ ...values });
            f7.dialog.close();
            authenticateUser(user);
          } catch (error) {
            f7.dialog.close();
            f7.dialog.alert(error?.response?.data || error?.message);
          }
        }}
        validateOnMount
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <List noHairlinesMd>
              <ListInput
                label={String(i18n.t('login.name'))}
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                errorMessageForce
                errorMessage={touched.name && errors.name}
              />
              <ListInput
                label={String(i18n.t('login.email'))}
                type="email"
                name="email"
                placeholder="이메일을 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={i18next.t('login.password')}
                type="password"
                name="password"
                placeholder="비밀번호를 입력해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce
                errorMessage={touched.password && errors.password}
              />
              <ListInput
                label={i18next.t('login.password_confirmation')}
                type="password"
                name="password_confirmation"
                placeholder="비밀번호를 확인해주세요"
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password_confirmation}
                errorMessageForce
                errorMessage={touched.password_confirmation && errors.password_confirmation}
              />
            </List>

            <div className="p-4">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                회원가입
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <Button className="w-full rounded-none" large href="/users/sign_in">
        이미 계정이 있습니다
      </Button>
    </Page>
  );
};

export default React.memo(SignUpPage);
