import React from 'react';
import Select from 'react-select';
import globalEnum from '../../../enums/globalEnum';

const { PaymentMethods, PaymentMethodNames } = globalEnum;

interface PaymentInfoSectionProps {
  form: any;
  updateNestedField: (parent: string, field: string, value: any) => void;
}

const PaymentInfoSection: React.FC<PaymentInfoSectionProps> = ({
                                                                 form,
                                                                 updateNestedField
                                                               }) => {
  const paymentMethodOptions = Object.entries(PaymentMethods).map(([key, value]) => ({
    value: key,
    label: PaymentMethodNames[key]
  }));

  return (
    <div className="infoSection">
      <h1 className="dashBoardTitle">اطلاعات پرداخت</h1>
      <div className="userInfoContainer">
        <span className="factorHeader">
          <p>{form?.isWebsite ? 'اپلیکیشن' : 'اپراتور'}</p>
        </span>

        <label className="sideBarTitle" htmlFor="paymentMethod">نحوه پرداخت</label>
        <Select
          id="paymentMethod"
          name="paymentMethod"
          value={{
            value: Object.keys(PaymentMethods).find(e => e === form?.payment?.method),
            label: PaymentMethodNames[Object.keys(PaymentMethods).find(e => e === form?.payment?.method) || '']
          }}
          options={paymentMethodOptions}
          className="dashCardLog"
          onChange={(selected) => updateNestedField('payment', 'method', selected.value)}
          aria-label="نحوه پرداخت"
        />

        <label className="sideBarTitle" htmlFor="walletBalance">کیف پول</label>
        <input
          id="walletBalance"
          disabled
          className="editProductInput"
          value={form?.user?.walletBalance || 0}
          aria-label="کیف پول"
        />

        <label className="sideBarTitle" htmlFor="paymentAmount">مبلغ</label>
        <input
          id="paymentAmount"
          className="editProductInput"
          value={form?.payment?.finalPrice || ''}
          onChange={(e) => updateNestedField('payment', 'finalPrice', e.target.value)}
          aria-label="مبلغ"
        />

        <label className="sideBarTitle" htmlFor="paymentAuthority">کد رهگیری</label>
        <input
          id="paymentAuthority"
          className="editProductInput"
          value={form?.payment?.refId || ''}
          onChange={(e) => updateNestedField('payment', 'refId', e.target.value)}
          aria-label="کد رهگیری"
        />

        <label className="sideBarTitle" htmlFor="paymentDescription">توضیحات</label>
        <textarea
          id="paymentDescription"
          className="editProductInput"
          value={form.payment?.description || ''}
          onChange={(e) => updateNestedField('payment', 'description', e.target.value)}
          aria-label="توضیحات"
        />
      </div>
      <button className="billButton">
        ارسال درگاه
      </button>
    </div>
  );
};

export default PaymentInfoSection;
