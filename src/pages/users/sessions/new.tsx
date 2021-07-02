import { loginAPI } from '@api';
import useAuth from '@hooks/useAuth';
import { Formik, FormikHelpers } from 'formik';
import { f7, List, ListInput, Page, Link } from 'framework7-react';
import React from 'react';
import * as Yup from 'yup';
import i18n from '../../../assets/lang/i18n';

interface FormValues {
  email: string;
  password: string;
}

const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required('필수 입력사항 입니다'),
  password: Yup.string().min(4, '길이가 너무 짧습니다').max(50, '길이가 너무 깁니다').required('필수 입력사항 입니다'),
});

const initialValues: FormValues = { email: '', password: '' };

const SessionNewPage = () => {
  const { authenticateUser } = useAuth();

  const handleLogin = async (params, setSubmitting) => {
    setSubmitting(true);
    try {
      const { data: user } = await loginAPI({ ...params });
      authenticateUser(user);
      // f7.dialog.alert('성공적으로 로그인 하였습니다. ', '알림');
    } catch (error) {
      // f7.dialog.alert('정보를 확인 해주세요. ', '알림');
      setSubmitting(false);
    }
  };

  return (
    <Page className="bg-white px-4">
      <p className="font-semibole text-2xl text-center mt-12">MARKETQ</p>
      <Formik
        initialValues={initialValues}
        validationSchema={SignInSchema}
        onSubmit={(values, { setSubmitting }: FormikHelpers<FormValues>) => handleLogin(values, setSubmitting)}
        validateOnMount
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
          <form onSubmit={handleSubmit}>
            <List>
              <ListInput
                label={String(i18n.t('login.email'))}
                name="email"
                type="email"
                placeholder="이메일을 입력해주세요."
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                errorMessageForce
                errorMessage={touched.email && errors.email}
              />
              <ListInput
                label={String(i18n.t('login.password'))}
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                clearButton
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                errorMessageForce
                errorMessage={touched.password && errors.password}
              />
            </List>
            <div className="p-1">
              <button
                type="submit"
                className="button button-fill button-large disabled:opacity-50"
                disabled={isSubmitting || !isValid}
              >
                로그인
              </button>
            </div>
          </form>
        )}
      </Formik>
      <div className="mt-6 grid grid-cols-3 px-2">
        <div>
          <Link href="/users/sign_up">
            <span>회원가입</span>
          </Link>
        </div>
        <div className="col-span-2 text-right">
          <span className="mr-2">아이디 찾기</span>
          <span>비밀번호 찾기</span>
        </div>
      </div>
    </Page>
  );
};

export default React.memo(SessionNewPage);
