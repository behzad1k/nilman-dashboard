import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import endpoints from '../../config/endpoints';
import { popupSlice } from '../../services/reducers';
import { setLoading } from '../../services/reducers/homeSlice';
import restApi from '../../services/restApi';
import { useAppSelector } from '../../services/store';
import tools from '../../utils/tools';
import LoadingBody from '../App/loading/LoadingBody';

const FeedbackModal = ({ order }) => {
  const dispatch: any = useDispatch();
  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState<any>();

  const fetchData = async () => {
    setIsloading(true);

    const res = await restApi(endpoints.order.feedback + order.id, true).get();

    if (res.code == 200) {
      setData(res.data);
    }

    setIsloading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isloading) {
    return (
      <main className="feebackModalContainer">
        <LoadingBody/>
      </main>
    );
  }

  return (
    <main className="feebackModalContainer">
      <h2>{order?.worker && order.worker?.name + ' ' + order.worker?.lastName}</h2>
      <div>
        {[...Array(data?.rating).keys()].map(e =>
          <span className='star'></span>
        )}
      </div>
      <div className='feedbackModalRow'>
        <div className='feedbackModalColumn'>
          {data?.feedbackFactors.filter(e => e.isPositive).map(e => <span className='feedbackModalCard positive'>{e.title}</span>)}
        </div>
        <div className='feedbackModalColumn'>
          {data?.feedbackFactors.filter(e => !e.isPositive).map(e => <span className='feedbackModalCard negative'>{e.title}</span>)}
        </div>
      </div>
      <p>{data?.description}</p>
    </main>
  );
};
export default FeedbackModal;