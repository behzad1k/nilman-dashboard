import React from 'react';
import moment from 'jalali-moment';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DatePicker from 'react-multi-date-picker';
import Select from 'react-select';
import Switch from 'react-ios-switch';
import globalEnum from '../../../enums/globalEnum';
import tools from '../../../utils/tools';

const { orderStatus, orderStatusNames } = globalEnum;

interface OrderInfoSectionProps {
  form: any;
  updateFormField: (field: string, value: any) => void;
  updateNestedField: (parent: string, field: string, value: any) => void;
  urgentAllPrices: (isUrgent: boolean) => void;
}

const OrderInfoSection: React.FC<OrderInfoSectionProps> = ({
                                                             form,
                                                             updateFormField,
                                                             updateNestedField,
  urgentAllPrices
                                                           }) => {
  const statusOptions = Object.entries(orderStatus).map(([key, value]) => ({
    value: key,
    label: orderStatusNames[key]
  }));

  const handleDateChange = (date: any) => {
    updateFormField('date', tools.persianNumToEn(date.format('YYYY/MM/DD')));
  };

  return (
    <div className="infoSection">
      <h1 className="dashBoardTitle">اطلاعات سفارش</h1>
      <div className="userInfoContainer">
        {form?.code && (
          <span className="factorHeader">
            <p>{form.code}</p>
          </span>
        )}

        <label className="sideBarTitle" htmlFor="orderStatus">وضعیت سفارش</label>
        <Select
          id="orderStatus"
          name="status"
          value={{
            value: Object.keys(orderStatus).find(e => e === form?.status),
            label: orderStatusNames[Object.keys(orderStatus).find(e => e === form?.status) || '']
          }}
          options={statusOptions}
          className="dashCardLog"
          onChange={(selected) => updateFormField('status', selected.value)}
          aria-label="وضعیت سفارش"
        />

        <label className="sideBarTitle" htmlFor="orderDate">تاریخ</label>
        <DatePicker
          id="orderDate"
          inputClass="editProductInput"
          calendar={persian}
          locale={persian_fa}
          value={form?.date}
          onChange={handleDateChange}
          aria-label="تاریخ"
        />

        <label className="sideBarTitle" htmlFor="orderTime">ساعت</label>
        <input
          id="orderTime"
          className="editProductInput"
          value={form?.time || ''}
          onChange={(e) => updateFormField('time', e.target.value)}
          aria-label="ساعت"
        />

        <div className="inputRow">
          <Switch
            checked={form.isUrgent || false}
            onChange={(checked) => {
              updateFormField('isUrgent', checked);
              urgentAllPrices(checked)
            }}
            aria-label="سفارش فوری"
          />
          <label className="sideBarTitle">سفارش فوری</label>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoSection;
