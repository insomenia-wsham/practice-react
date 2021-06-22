import { getUser, updateUser } from '@api';
import { Form, Formik, FormikHelpers } from 'formik';
import { sleep } from '@utils';
import { f7, Navbar, Page, List, ListInput, Button, Block, Row, Col } from 'framework7-react';
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import useAuth from '@hooks/useAuth';

interface FormValues {
  name: string;
  email: string;
}

interface PasswordFormValues {
  password: string;
  new_password: string;
  new_password_confirmation: string;
}

const UpdateSchema = Yup.object().shape({
  name: Yup.string().required('필수 입력사항 입니다.'),
  email: Yup.string(),
});

const PasswordSchema = Yup.object().shape({
  password: Yup.string().required('필수 입력사항 입니다.'),
  new_password: Yup.string().required('필수 입력사항 입니다.'),
  new_password_confirmation: Yup.string().required('필수 입력사항 입니다.'),
});

const UserEditPage = ({ f7route }) => {
  const { authenticateUser, currentUser } = useAuth();
  const userId = f7route.params.id;

  const initialValues: FormValues = {
    name: '',
    email: currentUser?.email,
  };

  const initialValuesPassword = {
    password: '',
    new_password: '',
    new_password_confirmation: '',
  };

  return (
    <Page noToolbar>
      <Navbar title="개인정보 수정" backLink />
      <Formik
        initialValues={initialValues}
        validationSchema={UpdateSchema}
        onSubmit={async (values, { setSubmitting }: FormikHelpers<FormValues>) => {
          await sleep(400);
          f7.dialog.preloader('잠시만 기다려주세요...');
          try {
            const { data } = await updateUser(userId, { ...values });
            authenticateUser(data);
          } catch (e) {
            throw new Error(e);
          } finally {
            setSubmitting(false);
            f7.dialog.close();
          }
        }}
        validateOnMount
      >
        {({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
          <Form>
            <List inlineLabels noHairlinesMd>
              <p className="p-3 text-base font-bold">기본정보</p>
              <ListInput
                label="이름"
                type="text"
                name="name"
                placeholder="이름을 입력해주세요"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                clearButton
              />
              <ListInput label="이메일" type="text" value={values.email} readonly />
              <Block strong>
                <Row>
                  <Col>
                    <Button fill className="m-5 mx-auto w-6/12" type="submit" disabled={isSubmitting || !isValid}>
                      기본정보 변경
                    </Button>
                  </Col>
                </Row>
              </Block>
            </List>
          </Form>
        )}
      </Formik>

      {/* <Formik
				initialValues={initialValuesPassword}
				validationSchema={PasswordSchema}
				onSubmit={async (values, { setSubmitting }: FormikHelpers<PasswordFormValues>) => {
					await sleep(400);
					f7.dialog.preloader('잠시만 기다려주세요...');
					try {
						// const { data } = await updatePassword(userId, { ...values });
						// authenticateUser(data);
					} catch (e) {
						throw new Error(e);
					} finally {
						setSubmitting(false);
						f7.dialog.close();
					}
				}}
				validateOnMount>
				{({ handleChange, handleBlur, values, errors, touched, isSubmitting, isValid }) => (
					<Form>
						<List inlineLabels noHairlinesMd>
							<p className="p-3 text-base font-bold">비밀번호 변경</p>
							<ListInput label="현재 비밀번호" type="password" name="password" placeholder="현재 비밀번호를 입력해주세요"
								value={values.password}
								onChange={handleChange}
								onBlur={handleBlur}
								clearButton />
							<ListInput label="새 비밀번호" type="password" name="new_password" placeholder="새 비밀번호를 입력해주세요"
								value={values.new_password}
								onChange={handleChange}
								onBlur={handleBlur}
								clearButton />
							<ListInput label="비밀번호 확인" type="password" name="new_password_confirmation" placeholder="새 비밀번호를 한번 더 확인해주세요"
								value={values.new_password_confirmation}
								onChange={handleChange}
								onBlur={handleBlur}
								clearButton />
							<Block strong>
								<Row>
									<Col>
										<Button raised className="m-5 mx-auto w-6/12" type="submit" disabled={isSubmitting || !isValid}>
											비민번호 변경
										</Button>
									</Col>
								</Row>
							</Block>
						</List>
					</Form>
				)}
			</Formik> */}
    </Page>
  );
};

export default React.memo(UserEditPage);
