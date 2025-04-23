import React from 'react';
import Switch from 'react-ios-switch';
import Select from 'react-select';
import Swal from 'sweetalert2';
import globalEnum from '../../../enums/globalEnum';
import { orderService } from './OrderService';

const { PaymentMethods, PaymentMethodNames } = globalEnum;

interface PaymentInfoSectionProps {
  form: any;
  updateNestedField: (parent: string, field: string, value: any) => void;
  id: string
}

const PaymentInfoSection: React.FC<PaymentInfoSectionProps> = ({
                                                                 form,
                                                                 updateNestedField,
  id
                                                               }) => {
  const paymentMethodOptions = Object.entries(PaymentMethods).map(([key, value]) => ({
    value: key,
    label: PaymentMethodNames[key]
  }));

  const sendPortal = async () => {
    const result = await orderService.sendPortal(id, form?.payment?.finalPrice, form?.payment?.method, form?.payment?.description, form?.payment?.refId, )
    if (result.success) {
      Swal.fire({
        title: 'موفق',
        text: 'لینک پرداخت با موفقیت ارسال شد',
        icon: 'success',
        confirmButtonText: 'متوجه شدم',
      });
    } else {
      Swal.fire({
        title: 'ناموفق',
        text: result.error || 'خطا در ثبت سفارش',
        icon: 'error',
        confirmButtonText: 'متوجه شدم'
      });
    }
  };

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

        <div className="inputRow">
          <Switch
            checked={form?.payment?.shouldUseWallet || false}
            onChange={(checked) => updateNestedField('payment', 'shouldUseWallet', checked)}
            aria-label="استفاده از کیف پول"
          />
          <label className="sideBarTitle">استفاده از کیف پول</label>
        </div>

        <label className="sideBarTitle" htmlFor="paymentAmount">مبلغ</label>
        <input
          id="paymentAmount"
          className="editProductInput"
          value={form?.payment?.finalPrice || 0}
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
        {form?.payment?.method == PaymentMethods.zarinpal &&
          <button className="addProductButton" onClick={sendPortal}>
              ارسال درگاه
          </button>
        }
      </div>
    </div>
  );
};

export default PaymentInfoSection;
