import React from 'react';
import Select from 'react-select';
import tools from '../../../utils/tools';

interface ServicesSectionProps {
  form: any;
  setForm: (form: any) => void;
  serviceReducer: any;
  isColored: boolean;
  colors: any[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
                                                           form,
                                                           setForm,
                                                           serviceReducer,
                                                           isColored,
                                                           colors
                                                         }) => {
  const handleServiceChange = (selected: any) => {
    setForm((prev: any) => ({
      ...prev,
      serviceId: selected.value
    }));
  };

  const handleAddService = () => {
    if (!form?.serviceId) return;

    setForm((prev: any) => ({
      ...prev,
      orderServices: [...prev.orderServices, {
        serviceId: 1,
        count: 1,
        colors: []
      }]
    }));
  };

  const handleRemoveService = (serviceId: number) => {
    setForm((prev: any) => ({
      ...prev,
      orderServices: prev.orderServices.filter((e: any) => e.serviceId !== serviceId)
    }));
  };

  const handleServiceItemChange = (serviceId: number, field: string, value: any) => {
    setForm((prev: any) => {
      const index = prev.orderServices.findIndex((e: any) => e.serviceId === serviceId);
      if (index === -1) return prev;

      const updatedServices = [...prev.orderServices];
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: value
      };

      return {
        ...prev,
        orderServices: updatedServices
      };
    });
  };

  const renderServiceRows = () => {
    return form?.orderServices?.map((orderProduct: any, index: number) => {
      const key = form.orderServices?.findIndex((e: any) => e.serviceId === orderProduct.serviceId);
      const service = serviceReducer.allServices?.find((e: any) => e.id === orderProduct.serviceId);
      const singlePrice = orderProduct.id
        ? orderProduct.singlePrice
        : (service?.price * (form?.isUrgent ? 1.5 : 1));
      const price = (orderProduct.count * singlePrice);

      return (
        <tr className="" key={`product-${index}`}>
          <td className="backGround1">
            <p>{tools.formatPrice(price)}</p>
          </td>
          <td className="">
            <p>{tools.formatPrice(singlePrice)}</p>
          </td>
          <td className="quantity">
            <div className="quantityButtom">
              <i
                className="tablePlusIcon"
                onClick={() => handleServiceItemChange(
                  orderProduct.serviceId,
                  'count',
                  Number(orderProduct.count) + 1
                )}
                role="button"
                aria-label="افزایش تعداد"
                tabIndex={0}
              ></i>
              <input
                type="number"
                className="quantityNumber"
                value={orderProduct.count}
                onChange={(e) => handleServiceItemChange(
                  orderProduct.serviceId,
                  'count',
                  e.target.value
                )}
                aria-label="تعداد"
              />
              <i
                className="tableCollapsIcon"
                onClick={() => {
                  if (orderProduct.count > 1) {
                    handleServiceItemChange(
                      orderProduct.serviceId,
                      'count',
                      Number(orderProduct.count) - 1
                    );
                  }
                }}
                role="button"
                aria-label="کاهش تعداد"
                tabIndex={0}
              ></i>
            </div>
          </td>

          {isColored && (
            <td>
              <Select
                styles={{
                  valueContainer: (base) => ({
                    ...base,
                    maxHeight: '120px',
                    overflow: 'auto',
                    minWidth: '120px'
                  })
                }}
                options={tools.selectFormatter(colors, 'id', 'title', 'انتخاب کنید')}
                defaultValue={orderProduct.colors?.map((colorId: number) => ({
                  value: colorId,
                  label: colors.find((color: any) => color.id === colorId)?.title
                }))}
                className="width100"
                id={`colors-${index}`}
                isMulti={true}
                name="serviceColors"
                onChange={(selected: any) => handleServiceItemChange(
                  orderProduct.serviceId,
                  'colors',
                  selected.map((e: any) => e.value)
                )}
                aria-label="رنگ‌ها"
              />
            </td>
          )}

          <td className="">
            <Select
              className="orderServiceSelect"
              options={serviceReducer.allServices.filter((e: any) => e.price > 0).map((e: any) => ({
                value: e.id,
                label: tools.findAncestors(serviceReducer.allServices, e.id)
                ?.filter((e: any, index: number) => (index < 3))
                .reverse()
                ?.reduce((acc: string, curr: any, index: number) =>
                  acc + ((index === 0 ? '' : '> ') + curr?.title), '')
              }))}
              value={{
                value: orderProduct.serviceId,
                label: tools.findAncestors(serviceReducer.allServices, orderProduct.serviceId)
                ?.filter((e: any, index: number) => (index < 3))
                .reverse()
                .map((attr: any, index: number) => (
                  <span key={`bread-${index}`} className="breadCrumbItem">
                      {(index === 0 ? '' : '> ') + attr?.title}
                    </span>
                ))
              }}
              onChange={(selected) => {
                if (key === undefined || key < 0) {
                  setForm((prev: any) => ({
                    ...prev,
                    orderServices: [...prev.orderServices, {
                      serviceId: selected.value,
                      id: null,
                      count: 1,
                      colors: []
                    }]
                  }));
                } else {
                  handleServiceItemChange(orderProduct.serviceId, 'serviceId', selected.value);
                }
              }}
              aria-label="خدمت"
            />
          </td>

          <td>
            <i
              className="cancelSvg"
              onClick={() => handleRemoveService(orderProduct.serviceId)}
              role="button"
              aria-label="حذف خدمت"
              tabIndex={0}
            ></i>
          </td>
        </tr>
      );
    });
  };

  return (
    <section className="bottom width100">
      <h6 className="dashBoardTitle">خدمات</h6>
      <Select
        options={[{ id: null }, ...serviceReducer.services.filter((e: any) => !e.parent)].map((e: any) => ({
          value: e.id,
          label: serviceReducer.services.find((j: any) => j.id === e?.id)?.title || 'انتخاب کنید'
        }))}
        value={{
          value: form?.serviceId,
          label: serviceReducer.services.find((e: any) => e.id === form?.serviceId)?.title || 'انتخاب کنید'
        }}
        onChange={handleServiceChange}
        className="width300p"
        aria-label="انتخاب دسته خدمت"
      />

      <table className="servicesTable">
        <thead className="editOrderTable">
        <tr>
          <th className="sideBarTitle center">قیمت کل</th>
          <th className="sideBarTitle center">قیمت واحد</th>
          <th className="sideBarTitle center">تعداد</th>
          {isColored && <th className="sideBarTitle center">رنگ</th>}
          <th className="sideBarTitle center">خدمت</th>
          <th className="sideBarTitle"></th>
        </tr>
        </thead>
        <tbody>
        {renderServiceRows()}
        <tr className="addProductTr">
          <td
            className="addProductButton clickable"
            colSpan={isColored ? 6 : 5}
            onClick={handleAddService}
            role="button"
            aria-label="اضافه کردن خدمت"
            tabIndex={0}
          >
            اضافه کردن خدمت
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  );
};

export default ServicesSection;
