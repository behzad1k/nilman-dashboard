import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { Sidebar } from '../../../layouts/Sidebar';
import { setLoading } from '../../../services/reducers/homeSlice';
import { useAppSelector } from '../../../services/store';
import { useOrderForm } from '../../../hooks/useOrderForm';
import { orderService } from './OrderService';
import UserInfoSection from './UserInfo';
import OrderInfoSection from './OrderInfo';
import PaymentInfoSection from './PaymentInfo';
import AddressSection from './Address';
import BillSummarySection from './BillSummary';
import ServicesSection from './Services';
import OrderCompletionSection from './OrderCompletion';
import { initialFormState } from '../../../utils/constants';
// import '../../../assets/css/orderManage.css';

const OrderManage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const serviceReducer = useAppSelector(state => state.serviceReducer);
  const [colors, setColors] = React.useState<any[]>([]);
  const {
    form,
    setForm,
    address,
    setAddress,
    updateFormField,
    updateNestedField,
    isColored,
    calculatePrices
  } = useOrderForm(initialFormState, serviceReducer);

  const isEdit = !!id;

  const handleSubmit = async () => {
    dispatch(setLoading(true));

    try {
      const result = await orderService.saveOrder(form, id);

      if (result.success) {
        Swal.fire({
          title: 'موفق',
          text: 'سفارش با موفقیت ثبت شد',
          icon: 'success',
          confirmButtonText: 'متوجه شدم',
          didClose() {
            navigate(-1);
          }
        });
      } else {
        Swal.fire({
          title: 'ناموفق',
          text: result.error || 'خطا در ثبت سفارش',
          icon: 'error',
          confirmButtonText: 'متوجه شدم'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'ناموفق',
        text: 'خطا در ارتباط با سرور',
        icon: 'error',
        confirmButtonText: 'متوجه شدم'
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchOrderData = async () => {
    if (!isEdit) return;

    dispatch(setLoading(true));
    try {
      const result = await orderService.fetchOrder(id);
      if (result.success) {
        setForm(result.data);
        setAddress(result.data.address);
      } else {
        Swal.fire({
          title: 'خطا',
          text: 'خطا در دریافت اطلاعات سفارش',
          icon: 'error',
          confirmButtonText: 'متوجه شدم'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'خطا',
        text: 'خطا در ارتباط با سرور',
        icon: 'error',
        confirmButtonText: 'متوجه شدم'
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch(setLoading(true));
      try {
        const res = await Promise.all([
          orderService.fetchColors(),
          fetchOrderData()
        ]);
        setColors(res[0].data);

      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    calculatePrices();
  }, [form.orderServices, form.transportation, form.discountAmount, form.isUrgent]);

  return (
    <div className="dashboardBody">
      <Sidebar />
      <main className="dashBoardMain main">
        <div className="addInfoHeader">
          <button
            className="dashboardHeader keepRight"
            onClick={handleSubmit}
            aria-label="ثبت سفارش"
          >
            <p>ثبت سفارش</p>
          </button>
          <span>
            <h1 className="sideBarTitle">بازگشت به صفحه لیست سفارش ها</h1>
            <h1 className="dashBoardTitle">{isEdit ? 'ویرایش' : 'ایجاد'} سفارش</h1>
          </span>
          <i
            className="backAdd"
            onClick={() => navigate('/order')}
            role="button"
            aria-label="بازگشت"
            tabIndex={0}
          ></i>
        </div>

        <section className="topRow">
          <UserInfoSection
            form={form}
            updateNestedField={updateNestedField}
            fetchUser={orderService.fetchUser}
          />
          <OrderInfoSection
            form={form}
            updateFormField={updateFormField}
            updateNestedField={updateNestedField}
          />
          <BillSummarySection
            form={form}
            updateFormField={updateFormField}
          />
        </section>

        <section className="topRow">
          <AddressSection
            form={form}
            address={address}
            setAddress={setAddress}
            updateNestedField={updateNestedField}
          />
          <PaymentInfoSection
            form={form}
            updateNestedField={updateNestedField}
          />
        </section>

        <ServicesSection
          form={form}
          setForm={setForm}
          serviceReducer={serviceReducer}
          isColored={isColored}
          colors={colors}
        />

        <OrderCompletionSection form={form} />
      </main>
    </div>
  );
};

export default OrderManage;
