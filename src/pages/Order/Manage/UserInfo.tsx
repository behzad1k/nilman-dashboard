import React from 'react';
import Switch from 'react-ios-switch';

interface UserInfoSectionProps {
  form: any;
  updateNestedField: (parent: string, field: string, value: any) => void;
  fetchUser: (phoneNumber: string) => Promise<any>;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
                                                           form,
                                                           updateNestedField,
                                                           fetchUser
                                                         }) => {
  const handlePhoneNumberChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value;
    updateNestedField('user', 'phoneNumber', phoneNumber);

    if (phoneNumber.length === 11) {
      const result = await fetchUser(phoneNumber);
      if (result.success) {
        // Update the form with the fetched user data
        Object.entries(result.data).forEach(([key, value]) => {
          updateNestedField('user', key, value);
        });
      }
    }
  };

  return (
    <div className="infoSection">
      <h1 className="dashBoardTitle">اطلاعات کاربر</h1>
      <div className="userInfoContainer">
        <label className="sideBarTitle" htmlFor="phoneNumber">شماره تلفن</label>
        <input
          id="phoneNumber"
          className="editProductInput"
          value={form?.user?.phoneNumber || ''}
          onChange={handlePhoneNumberChange}
          aria-label="شماره تلفن"
        />

        <label className="sideBarTitle" htmlFor="name">نام</label>
        <input
          id="name"
          className="editProductInput"
          value={form?.user?.name || ''}
          onChange={(e) => updateNestedField('user', 'name', e.target.value)}
          aria-label="نام"
        />

        <label className="sideBarTitle" htmlFor="lastName">نام و خانوادگی</label>
        <input
          id="lastName"
          className="editProductInput"
          value={form?.user?.lastName || ''}
          onChange={(e) => updateNestedField('user', 'lastName', e.target.value)}
          aria-label="نام خانوادگی"
        />

        <label className="sideBarTitle" htmlFor="nationalCode">کد ملی</label>
        <input
          id="nationalCode"
          className="editProductInput"
          value={form?.user?.nationalCode || ''}
          onChange={(e) => updateNestedField('user', 'nationalCode', e.target.value)}
          aria-label="کد ملی"
        />
      </div>
    </div>
  );
};

export default UserInfoSection;
