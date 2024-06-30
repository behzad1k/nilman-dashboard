"use client"
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { popupSlice } from '../../../services/reducers';
import { useAppSelector } from '../../../services/store';

const Popup = () => {
  const popupReducer = useAppSelector(state => state.popupReducer);
  const dispatch: any = useDispatch();

  const list = () => {
    const rows: any[] = [];

    popupReducer.popups.forEach((item, index) => {
      rows.push(
        <div key={'popup' + index}>
          <div
            className="modalOverLay"
            style={{zIndex: index + 1, display: item.visible ? 'inline-block' : 'none'}}
            onClick={() => dispatch(popupSlice.hide())}
          />
          <div style={{ ...item.style, zIndex: index + 2, display: item.visible ? 'inline-flex' : 'none'}}>
            {item.content}
          </div>
        </div>
      )
    });

    return rows;
  }

  useEffect(() => {
    if (popupReducer.popups.length > 0 && popupReducer.popups[0].visible) {
      document.body.classList.add('onPopup');
    } else {
      document.body.classList.remove('onPopup');
    }
  }, [popupReducer.popups.length]);

  return (
    <>
      {list()}
    </>
  )
};

export default Popup;