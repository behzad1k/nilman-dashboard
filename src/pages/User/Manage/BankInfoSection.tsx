import React from 'react';
import { IUser } from '../../../types/types';

interface BankInfoSectionProps {
  user: IUser;
}

const BankInfoSection: React.FC<BankInfoSectionProps> = ({ user }) => {
  return (
    <section className="bottom">
      <h6 className="dashBoardTitle">اطلاعات بانکی</h6>
      <div className="bank-info-container">
        <div className="bank-info-row">
          <label className="sideBarTitle">شماره کارت</label>
          <input className="editProductInput" defaultValue={user?.cardNumber} name="cardNumber" />
        </div>

        <div className="bank-info-row">
          <label className="sideBarTitle">شماره حساب</label>
          <input className="editProductInput" defaultValue={user?.hesabNumber} name="hesabNumber" />
        </div>

        <div className="bank-info-row">
          <label className="sideBarTitle">شماره شبا</label>
          <input className="editProductInput" defaultValue={user?.shebaNumber} name="shebaNumber" />
        </div>

        <div className="bank-info-row">
          <label className="sideBarTitle">نام بانک</label>
          <input className="editProductInput" defaultValue={user?.bankName} name="bankName" />
        </div>
      </div>
    </section>
  );
};

export default BankInfoSection;
