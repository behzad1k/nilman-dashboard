import React from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { popupSlice } from '../../../services/reducers';
import MapModal from '../../../layouts/Modal/MapModal';
import tools from '../../../utils/tools';

interface AddressSectionProps {
  form: any;
  address: any;
  setAddress: (address: any) => void;
  updateNestedField: (parent: string, field: string, value: any) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({
                                                         form,
                                                         address,
                                                         setAddress,
                                                         updateNestedField
                                                       }) => {
  const dispatch = useDispatch();

  const handleAddressSelect = (selected: any) => {
    const selectedAddress = form.user?.addresses?.find(e => e.id === selected.value) || {
      phoneNumber: '',
      title: '',
      vahed: '',
      pelak: '',
      description: '',
      id: null
    };

    setAddress(selectedAddress);
  };

  const openMapModal = () => {
    dispatch(popupSlice.middle(<MapModal address={address} setAddress={setAddress} />));
  };

  return (
    <div className="infoSection">
      <h1 className="dashBoardTitle">آدرس</h1>
      <div className="userInfoContainer">
        <label className="sideBarTitle" htmlFor="addressSelect">آدرس های پیشین</label>
        <Select
          id="addressSelect"
          className="addressInput dirRtl width100"
          options={tools.selectFormatter(form.user?.addresses, 'id', 'description', 'آدرس جدید')}
          value={{
            value: form?.address?.id || '',
            label: form.user?.addresses?.find(e => e.id === form?.address?.id)?.description || 'آدرس جدید'
          }}
          onChange={handleAddressSelect}
          aria-label="آدرس های پیشین"
        />

        <label className="sideBarTitle" htmlFor="addressTitle">عنوان</label>
        <input
          id="addressTitle"
          className="editProductInput"
          type="text"
          value={form.address?.title || ''}
          onChange={(e) => updateNestedField('address', 'title', e.target.value)}
          aria-label="عنوان آدرس"
        />

        <label className="sideBarTitle" htmlFor="addressPhone">شماره تماس</label>
        <input
          id="addressPhone"
          className="editProductInput"
          type="text"
          value={form.address?.phoneNumber || ''}
          onChange={(e) => updateNestedField('address', 'phoneNumber', e.target.value)}
          aria-label="شماره تماس آدرس"
        />

        <label className="sideBarTitle" htmlFor="addressPelak">پلاک</label>
        <input
          id="addressPelak"
          className="editProductInput"
          type="text"
          value={form.address?.pelak || ''}
          onChange={(e) => updateNestedField('address', 'pelak', e.target.value)}
          aria-label="پلاک"
        />

        <label className="sideBarTitle" htmlFor="addressVahed">واحد</label>
        <input
          id="addressVahed"
          className="editProductInput"
          type="text"
          value={form.address?.vahed || ''}
          onChange={(e) => updateNestedField('address', 'vahed', e.target.value)}
          aria-label="واحد"
        />

        <label className="sideBarTitle" htmlFor="addressDescription">جزئیات آدرس</label>
        <textarea
          id="addressDescription"
          className="editProductInput"
          value={form.address?.description || ''}
          onChange={(e) => updateNestedField('address', 'description', e.target.value)}
          aria-label="جزئیات آدرس"
        />

        <button
          className="addProductButton"
          onClick={openMapModal}
          aria-label="ویرایش آدرس"
        >ویرایش آدرس</button>
      </div>
    </div>
  );
};

export default AddressSection;
