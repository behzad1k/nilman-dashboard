import restApi from '../../../services/restApi';
import endpoints from '../../../config/endpoints';
import { OrderFormState } from '../../../types/types';

export const orderService = {
  fetchColors: async () => {
    try {
      const res = await restApi(endpoints.color.index, true).get();
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Error fetching colors:', error);
      return { success: false, error };
    }
  },

  fetchUser: async (phoneNumber: string) => {
    try {
      const res = await restApi(endpoints.user.findBy, true).get({ phoneNumber });
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { success: false, error };
    }
  },

  fetchOrder: async (id: string) => {
    try {
      const res = await restApi(endpoints.order.single + id, true).get();

      // Transform the data to match our form structure
      const formattedData = {
        date: res.data?.date,
        time: res.data?.fromTime,
        code: res.data?.code,
        status: res.data?.status,
        finalPrice: res.data.finalPrice,
        price: Number(res.data?.price),
        serviceId: res.data?.serviceId,
        transportation: res.data?.transportation,
        discountAmount: res.data?.discountAmount,
        orderServices: res.data?.orderServices.map(e => ({
          ...e,
          colors: e.colors.map(j => j.id)
        })),
        address: res.data?.user?.addresses?.find(e => e.id === res.data?.addressId),
        addressId: res.data?.addressId,
        user: res.data?.user,
        createdAt: res.data?.createdAt,
        isMulti: res.data?.isMulti,
        isUrgent: res.data?.isUrgent,
        finalImage: res.data?.finalImage,
        doneDate: res.data?.doneDate,
        startDate: res.data?.startDate,
        shouldUseWallet: false,
        payment: res.data?.payment,
        isWebsite: res.data?.isWebsite,
      };

      return { success: true, data: formattedData };
    } catch (error) {
      console.error('Error fetching order:', error);
      return { success: false, error };
    }
  },

  saveOrder: async (form: OrderFormState, id?: string) => {
    try {
      let userRes, addressRes;

      // If creating a new order, handle user and address creation/update
      if (!id) {
        if (!form.user?.isVerified) {
          const verifyNationalCode = await restApi(process.env.REACT_APP_BASE_URL + '/admin/user/verify').post({
            phoneNumber: form.user.phoneNumber,
            nationalCode: form.user.nationalCode
          });

          if (verifyNationalCode.code === 1005) {
            const shouldContinue = window.confirm('کد ملی با شماره تلفن تطابق ندارد آیا به هرحال سفارش ثبت شود؟');
            if (!shouldContinue) {
              return { success: false, error: 'عملیات لغو شد' };
            }
          }
        }

        userRes = await restApi(process.env.REACT_APP_BASE_URL + '/admin/user/basic/' + (form?.user?.id || '')).post({
          name: form.user.name,
          lastName: form.user.lastName,
          nationalCode: form.user.nationalCode,
          phoneNumber: form.user.phoneNumber,
          isVerified: form.user.isVerified
        });

        addressRes = await restApi(process.env.REACT_APP_BASE_URL + '/admin/address/basic/' + (form?.address?.id || '')).post({
          title: form.address.title,
          phoneNumber: form.address.phoneNumber,
          description: form.address.description,
          vahed: form.address.vahed,
          pelak: form.address.pelak,
          userId: userRes.data?.id,
          longitude: form.address.longitude,
          latitude: form?.address?.latitude
        });
      }

      // Create or update the order
      const res = await restApi(process.env.REACT_APP_BASE_URL + '/admin/order/basic/' + (id || '')).post({
        date: form.date,
        time: form.time,
        status: form.status,
        finalPrice: form.finalPrice,
        price: form.price,
        serviceId: form.serviceId,
        discountAmount: form.discountAmount,
        transportation: form.transportation,
        addressId: form.address.id || addressRes?.data.id,
        userId: form.user?.id || userRes?.data?.id,
        isMulti: form.isMulti,
        isUrgent: form.isUrgent,
      });

      // Update order services and payment
      await Promise.all([
        restApi(process.env.REACT_APP_BASE_URL + '/admin/order/products/' + res.data.id).put({
          services: form.orderServices.map(e => ({
            serviceId: e.serviceId,
            count: e.count,
            colors: e.colors
          }))
        }),
        restApi(process.env.REACT_APP_BASE_URL + '/admin/order/payment/' + res.data.id).put({
          method: form?.payment?.method,
          finalPrice: form?.payment?.finalPrice,
          shouldUseWallet: form?.payment?.shouldUseWallet,
          refId: form?.payment?.refId,
          description: form?.payment?.description
        })
      ]);

      return { success: true, data: res.data };
    } catch (error) {
      console.error('Error saving order:', error);
      return { success: false, error: error.message || 'خطا در ذخیره سفارش' };
    }
  }
};
