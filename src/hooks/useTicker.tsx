import { useAppSelector } from '../services/store';
import tools from '../utils/tools';

const useTicker = () => {
  const euroPrice = useAppSelector(state => state.tickerReducer.euroPrice)
  const userReducer = useAppSelector(state => state.userReducer.profile)

  const ticker = (price: number) => {
    return price * euroPrice;
  };

  const calcPrice = (price: number, format = true) => {
    return format ? tools.formatPrice(price + (price * userReducer.specialPercent / 100)) : price + (price * userReducer.specialPercent / 100)
  }
  return {
    ticker,
    calcPrice
  }
};

export default useTicker;