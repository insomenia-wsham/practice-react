import { useRecoilState } from 'recoil';
import { userSelector } from '@selectors';

const useUser = () => {
  const [currentUserInfo, setCurrentUserInfo] = useRecoilState<any>(userSelector);

  const handleUpdateUser = (updateData) => {
    setCurrentUserInfo(updateData);
  };

  return {
    currentUserInfo,
    handleUpdateUser,
  };
};

export default useUser;
