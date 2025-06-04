import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import endpoints from '../../../config/endpoints';
import { Sidebar } from '../../../layouts/Sidebar';
import { setLoading } from '../../../services/reducers/homeSlice';
import restApi from '../../../services/restApi';
import { IService, IDistrict, IUser, IAddress, IWorkerOff } from '../../../types/types';
import tools from '../../../utils/tools';
import UserInfoSection from './UserInfoSection';
import AddressesSection from './AddressesSection';
import OrdersSection from './OrdersSection';
import WorkerOffsSection from './WorkerOffsSection';
import BankInfoSection from './BankInfoSection';
import UserImageSection from './UserImageSection';
import { formatWorkerOffs } from '../../../utils/formatters';

const UserManage: React.FC = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [workerOffs, setWorkerOffs] = useState<Record<string, IWorkerOff[]>>({});
  const [user, setUser] = useState<IUser>({} as IUser);
  const [services, setServices] = useState<IService[]>([]);
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [selectedWorkerServices, setSelectedWorkerServices] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [image, setImage] = useState<{
    data?: File;
    preview?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));

    const formData = new FormData(e.currentTarget);

    try {
      const res = await restApi(endpoints.user.basic + (paramId || '')).post({
        name: formData.get('name'),
        lastName: formData.get('lastName'),
        nationalCode: formData.get('nationalCode'),
        phoneNumber: formData.get('phoneNumber'),
        password: formData.get('password'),
        email: formData.get('email'),
        percent: formData.get('percent'),
        role: formData.get('role'),
        status: formData.get('status'),
        username: formData.get('username'),
        bankName: formData.get('bankName'),
        shebaNumber: formData.get('shebaNumber'),
        cardNumber: formData.get('cardNumber'),
        hesabNumber: formData.get('hesabNumber'),
        walletBalance: formData.get('walletBalance'),
        services: selectedWorkerServices,
        districts: selectedDistricts,
        isWorkerChoosable: user?.isWorkerChoosable,
      });

      if (res.data?.id && image.data) {
        const imageFormData = new FormData();
        imageFormData.append('file', image.data);
        await restApi(endpoints.user.medias + res.data?.id).upload(imageFormData);
      }

      if (res.code === 200) {
        Swal.fire({
          title: 'موفق',
          text: `کاربر با موفقیت ${paramId ? 'ویرایش' : 'ساخته'} شد`,
          icon: 'success',
          confirmButtonText: 'متوجه شدم',
          didClose() {
            navigate(-1);
          }
        });
      } else {
        Swal.fire({
          title: 'ناموفق',
          text: res?.data,
          icon: 'error',
          confirmButtonText: 'متوجه شدم'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'خطا',
        text: 'خطایی در ارسال اطلاعات رخ داد',
        icon: 'error',
        confirmButtonText: 'متوجه شدم'
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchData = async () => {
    dispatch(setLoading(true));

    try {
      const [servicesRes, districtsRes, userRes] = await Promise.all([
        restApi(endpoints.service.client).get(),
        restApi(endpoints.district.index).get(),
        paramId ? restApi(endpoints.user.single + paramId).get() : Promise.resolve(null),
      ]);

      setDistricts(districtsRes.data);

      const sortedServices: IService[] = [];
      servicesRes?.data?.forEach((service: IService) => {
        tools.extractChildren(service, sortedServices);
      });

      setServices(sortedServices);

      if (userRes && paramId) {
        setUser(userRes.data);
        setAddresses(userRes.data?.addresses || []);
        setSelectedWorkerServices(userRes.data?.services.filter(e => e.openDrawer)?.map((s: IService) => s.id) || []);
        setSelectedDistricts(userRes.data?.districts?.map((d: IDistrict) => d.id) || []);

        if (userRes.data?.profilePic?.url) {
          setImage({ preview: userRes.data?.profilePic?.url });
        }

        const formattedWorkerOffs = formatWorkerOffs(userRes.data?.workerOffs || []);
        setWorkerOffs(formattedWorkerOffs);
      }
    } catch (error) {
      Swal.fire({
        title: 'خطا',
        text: 'خطایی در دریافت اطلاعات رخ داد',
        icon: 'error',
        confirmButtonText: 'متوجه شدم'
      });
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, [paramId]);

  return (
    <main className="dashboardBody">
      <Sidebar />
      <form className="dashBoardMain main" onSubmit={handleSubmit}>
        <div className="addInfoHeader">
          <button className="dashboardHeader keepRight clickable" type="submit">
            ارسال
          </button>
          <span>
            <h1 className="sideBarTitle"> بازگشت به صفحه کاربران</h1>
            <h1 className="dashBoardTitle">ویرایش کاربر</h1>
          </span>
          <i className="backAdd clickable" onClick={() => navigate('/user/')}></i>
        </div>

        <UserInfoSection
          user={user}
          setUser={setUser}
          services={services}
          districts={districts}
          selectedWorkerServices={selectedWorkerServices}
          setSelectedWorkerServices={setSelectedWorkerServices}
          selectedDistricts={selectedDistricts}
          setSelectedDistricts={setSelectedDistricts}
        />

        <AddressesSection
          addresses={addresses}
          userId={paramId}
        />

        <div className="">
          <OrdersSection
            orders={[...(user?.orders || []), ...(user?.jobs || [])]}
          />
          <div>

          {user?.role === 'WORKER' && (
            <BankInfoSection user={user} />
          )}

          <UserImageSection
            image={image}
            setImage={setImage}
          />
          </div>
        </div>


        <WorkerOffsSection
          workerOffs={workerOffs}
          userId={user?.id?.toString()}
          onDelete={fetchData}
        />
      </form>
    </main>
  );
};

export default UserManage;
