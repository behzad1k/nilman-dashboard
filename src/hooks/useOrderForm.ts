import React, { useState, useCallback, useMemo, useEffect } from 'react';
import globalEnum from '../enums/globalEnum';
import { OrderFormState, OrderService } from '../types/types';
import PaymentMethods = globalEnum.PaymentMethods;

export const useOrderForm = (initialState: OrderFormState, serviceReducer: any) => {
  const [form, setForm] = useState<OrderFormState>(initialState);
  const [address, setAddress] = useState(form?.address);
  const [userBalance, setUserBalance] = React.useState(0);

  const updateFormField = useCallback((field: keyof OrderFormState, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateNestedField = useCallback((parent: keyof OrderFormState, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as object),
        [field]: value
      }
    }));
  }, []);

  const isColored = useMemo(() => {
    return form?.orderServices?.some(service =>
      serviceReducer?.allServices?.find(s => s.id === service.serviceId)?.hasColor
    );
  }, [form?.orderServices, serviceReducer?.allServices]);

  const calculatePrices = useCallback(() => {
    if (!serviceReducer?.allServices?.length) return;
    const newPrice = form.orderServices?.reduce((acc, curr) => {
      const service = serviceReducer.allServices?.find(e => e.id === curr.serviceId);
      if (!service) return acc;
      let price = 0;
      if (curr.singlePrice){
        price = curr.singlePrice * Number(curr.count);
      } else {
        price = service.price * (form.isUrgent ? 1.5 : 1) * Number(curr.count);
      }
        return acc + Number(price);
    }, 0) || 0;

    const finalPrice = newPrice + (form?.transportation || 0) - Number(form?.discountAmount || 0);

    let paymentPrice = finalPrice;
    let newUserBalance = form?.user?.walletBalance;
    let method = form?.payment?.method;

    if (form?.payment?.shouldUseWallet){
      if (finalPrice > userBalance){
        paymentPrice = finalPrice - userBalance;
        newUserBalance = 0;
      } else {
        newUserBalance = userBalance - finalPrice;
        method = PaymentMethods.credit;
        paymentPrice = 0;
      }
    } else {
      newUserBalance = userBalance;
    }

    setForm(prev => ({
      ...prev,
      price: newPrice,
      finalPrice: finalPrice,
      payment: {
        ...prev.payment,
        finalPrice: paymentPrice,
        method: method
      },
      user: {
        ...prev.user,
        walletBalance: newUserBalance
      }
    }));
  }, [form.orderServices, form.isUrgent, serviceReducer.allServices, form.payment?.shouldUseWallet, form.transportation]);

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      address
    }));
  }, [address]);

  return {
    form,
    setForm,
    address,
    setAddress,
    updateFormField,
    updateNestedField,
    isColored,
    calculatePrices,
    setUserBalance
  };
};
