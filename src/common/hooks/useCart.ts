import { useRecoilState } from 'recoil';
import { cartSelector } from '@selectors';
// import { CartData } from '@constants';

const useCart = () => {
  const [currentCart, setCurrentCart] = useRecoilState<any>(cartSelector);

  const handleUpdateCart = (updateData) => {
    setCurrentCart(updateData);
  };

  return {
    currentCart,
    handleUpdateCart,
  };
};

export default useCart;
