import React from 'react';
import moment from 'jalali-moment';

interface BillSummarySectionProps {
  form: any;
  updateFormField: (field: string, value: any) => void;
}

const BillSummarySection: React.FC<BillSummarySectionProps> = ({
                                                                 form,
                                                                 updateFormField
                                                               }) => {
  return (
    <div className="infoSection">
      <h1 className="dashBoardTitle">مجموع فاکتور</h1>
      <div className="userInfoContainer">
        {form?.createdAt && (
          <span className="factorHeader">
            <p>{moment(form?.createdAt).format('jYYYY/jMM/jDD')}</p>
          </span>
        )}

        <span className="billItems dashboardBill marginTop">
          <h3 className="billItem">ایاب ذهاب</h3>
          <div className="pricePart">
            <input
              className="editProductInput order"
              value={form?.transportation || 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                updateFormField('transportation', value >= 0 ? value : 0);
              }}
              type="number"
              aria-label="هزینه ارسال"
            />
          </div>
        </span>

        <span className="billItems dashboardBill">
          <h3 className="billItem">مبلغ سفارش</h3>
          <div className="pricePart">
            <input
              className="editProductInput order"
              value={form?.price || 0}
              onChange={(e) => updateFormField('price', Number(e.target.value))}
              type="number"
              aria-label="مبلغ سفارش"
            />
          </div>
        </span>

        <span className="billItems dashboardBill">
          <h3 className="billItem">تخفیف</h3>
          <div className="pricePart">
            <input
              className="editProductInput order"
              value={form?.discountAmount || 0}
              onChange={(e) => {
                const value = Number(e.target.value);
                updateFormField('discountAmount', value >= 0 ? value : 0);
              }}
              type="number"
              aria-label="تخفیف"
            />
          </div>
        </span>

        <hr className="dashedBill" />

        <span className="billItems dashboardBill">
          <h3 className="billItem">مبلغ قابل پرداخت</h3>
          <div className="pricePart">
            <input
              className="editProductInput order"
              value={form?.finalPrice || 0}
              onChange={(e) => updateFormField('finalPrice', Number(e.target.value))}
              type="number"
              aria-label="مبلغ قابل پرداخت"
            />
          </div>
        </span>
      </div>
    </div>
  );
};

export default BillSummarySection;
