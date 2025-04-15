import React from 'react';
import moment from 'jalali-moment';

interface OrderCompletionInfoProps {
  form: any;
}

const OrderCompletionInfo: React.FC<OrderCompletionInfoProps> = ({ form }) => {
  if (!form?.startDate && !form?.doneDate && !form?.finalImage?.url) {
    return null;
  }

  return (
    <>
      {form?.startDate && (
        <h6 className="dashBoardTitle">
          زمان شروع: {moment(form?.startDate).format('jYYYY/jMM/jDD HH:mm')}
        </h6>
      )}

      {form?.doneDate && (
        <h6 className="dashBoardTitle">
          زمان پایان: {moment(form?.doneDate).format('jYYYY/jMM/jDD HH:mm')}
        </h6>
      )}

      {form?.finalImage?.url && (
        <section className="bottom width100">
          <h6 className="dashBoardTitle">عکس پایان کار</h6>
          <img
            className="orderFinalImage"
            src={form.finalImage?.url}
            alt="تصویر پایان کار"
          />
        </section>
      )}
    </>
  );
};

export default OrderCompletionInfo;
