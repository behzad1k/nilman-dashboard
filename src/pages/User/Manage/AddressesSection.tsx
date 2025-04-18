import React from 'react';
import { useDispatch } from 'react-redux';
import { popupSlice } from '../../../services/reducers';
import MapModal from '../../../layouts/Modal/MapModal';
import { IAddress } from '../../../types/types';

interface AddressesSectionProps {
  addresses: IAddress[];
  userId?: string;
}

const AddressesSection: React.FC<AddressesSectionProps> = ({ addresses, userId }) => {
  const dispatch = useDispatch();

  return (
    <section className="bottom">
      <h6 className="dashBoardTitle">آدرس ها</h6>
      <button
        type="button"
        className="btn-add"
        onClick={() => dispatch(popupSlice.middle(<MapModal userId={userId} />))}
      >
        افزودن آدرس
      </button>
      <div className="addresses-container">
        {addresses.map(address => (
          <div key={address.id} className="bottomDiv">
            <span className="adressCard">
              <div className="addressCardRight">
                <span className="adressPin">
                  <i className="mapPin"></i>
                  <h6>{address?.title}</h6>
                </span>
                <p className="adressText marginZero">
                  {address?.description}
                  <br/>{address?.phoneNumber}
                </p>
              </div>
              <div className="addressImage">
                <img src="/img/map.jpg" className="mapPhoto" alt="Map" />
                <span className="svgContainer">
                  <i
                    className="edit clickable"
                    onClick={() => dispatch(popupSlice.middle(<MapModal userId={userId} address={address} />))}
                  ></i>
                </span>
              </div>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AddressesSection;
