import { useState, useCallback, useMemo, useEffect } from 'react';
import { OrderFormState, OrderService } from '../types/types';

export const useOrderForm = (initialState: OrderFormState, serviceReducer: any) => {
  const [form, setForm] = useState<OrderFormState>(initialState);
  const [address, setAddress] = useState(form?.address);

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

      const price = service.price * Number(curr.count) * (form?.isUrgent ? 1.5 : 1);
      return acc + Number(price);
    }, 0) || 0;

    setForm(prev => ({
      ...prev,
      price: newPrice,
      finalPrice: newPrice + (prev?.transportation || 0) - Number(prev?.discountAmount || 0)
    }));
  }, [form.orderServices, form.isUrgent, serviceReducer.allServices]);

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
    calculatePrices
  };
};
