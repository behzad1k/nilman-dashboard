import React from 'react';
import Select from 'react-select';
import Switch from 'react-ios-switch';
import globalEnum from '../../../enums/globalEnum';
import tools from '../../../utils/tools';
import { IUser, IService, IDistrict } from '../../../types/types';

interface UserInfoSectionProps {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  services: IService[];
  districts: IDistrict[];
  selectedWorkerServices: string[];
  setSelectedWorkerServices: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDistricts: string[];
  setSelectedDistricts: React.Dispatch<React.SetStateAction<string[]>>;
}

const UserInfoSection: React.FC<UserInfoSectionProps> = ({
                                                           user,
                                                           setUser,
                                                           services,
                                                           districts,
                                                           selectedWorkerServices,
                                                           setSelectedWorkerServices,
                                                           selectedDistricts,
                                                           setSelectedDistricts
                                                         }) => {
  return (
    <section className="userInfo">
      <h1 className="dashBoardTitle">اطلاعات کاربر</h1>
      <div className="userInfoContainer user">
        <div className="section30">
          {user?.role === globalEnum.roles.WORKER && (
            <>
              <label className="sideBarTitle">خدمت مربوطه</label>
              <Select
                styles={{
                  valueContainer: (base) => ({
                    ...base,
                    maxHeight: '120px',
                    overflow: 'auto'
                  })
                }}
                options={tools.selectFormatter(services.filter(e => e.openDrawer), 'id', 'title', 'انتخاب کنید')}
                defaultValue={selectedWorkerServices?.map(e => ({
                  value: e,
                  label: services.find(j => j.id == Number(e))?.title
                }))}
                className="width100"
                id="infoTitle"
                isMulti={true}
                name='workerServices'
                onChange={(selected: any) => setSelectedWorkerServices(selected.map((e: any) => e.value))}
              />
              <label className="sideBarTitle">درصد همکاری</label>
              <input className="editProductInput" defaultValue={user?.percent} name="percent" />
              <label className="sideBarTitle">مناطق تحت پوشش</label>
              <Select
                options={tools.selectFormatter(districts, 'id', 'title', 'انتخاب کنید')}
                defaultValue={selectedDistricts?.map(e => ({
                  value: e,
                  label: districts.find(j => j.id === e)?.title
                }))}
                className="width100"
                id="infoTitle"
                isMulti={true}
                name='workerServices'
                onChange={(selected: any) => setSelectedDistricts(selected.map((e: any) => e.value))}
              />
            </>
          )}

          {(user?.role === globalEnum.roles.SUPER_ADMIN || user?.role === globalEnum.roles.OPERATOR || user?.role === globalEnum.roles.WORKER) && (
            <>
              <label className="sideBarTitle">نام کاربری</label>
              <input className="editProductInput" defaultValue={user?.username} name="username" />
              <label className="sideBarTitle">رمز عبور <small>(فقط در صورت نیاز به تغییر وارد کنید)</small></label>
              <input className="editProductInput" name="password" type="password" />
            </>
          )}

          {user?.role === globalEnum.roles.USER && (
            <>
              <label className="sideBarTitle">قابلیت انتخاب آرایشگر</label>
              <Switch
                checked={user?.isWorkerChoosable || false}
                name="isWorkerChoosable"
                onChange={(checked) => setUser(prev => ({ ...prev, isWorkerChoosable: checked }))}
              />
            </>
          )}
        </div>

        <div className="section30">
          <label className="sideBarTitle">نام</label>
          <input className="editProductInput" defaultValue={user?.name} name="name" />
          <label className="sideBarTitle">نام خانوادگی</label>
          <input className="editProductInput" defaultValue={user?.lastName} name="lastName" />
          <label className="sideBarTitle">شماره تلفن</label>
          <input className="editProductInput" defaultValue={user?.phoneNumber} name="phoneNumber" />
        </div>

        <div className="section30">
          <label className="sideBarTitle">وضعیت</label>
          <select
            className="selector30"
            value={user?.status}
            name="status"
            onChange={(e) => setUser(prev => ({ ...prev, status: Number(e.target.value) }))}
          >
            <option value={0}>غیر فعال</option>
            <option value={1}>فعال</option>
          </select>

          <label className="sideBarTitle">نقش کاربری</label>
          <select
            className="selector30"
            name="role"
            value={user?.role}
            onChange={(e) => setUser(prev => ({ ...prev, role: e.target.value }))}
          >
            {Object.entries(globalEnum.roles).map(([key, value]) => (
              <option value={key} key={key}>{value}</option>
            ))}
          </select>

          <label className="sideBarTitle">کد ملی</label>
          <input className="editProductInput" defaultValue={user?.nationalCode} name="nationalCode" />

          <label className="sideBarTitle">کیف پول</label>
          <input className="editProductInput" defaultValue={user?.walletBalance} name="walletBalance" />
        </div>
      </div>
    </section>
  );
};

export default UserInfoSection;
