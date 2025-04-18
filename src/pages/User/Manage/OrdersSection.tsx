import React, { useState } from 'react';
import tools from '../../../utils/tools';
import { IOrder } from '../../../types/types';
import Pagination from '../../../layouts/Pagination';

interface OrdersSectionProps {
  orders: IOrder[];
}

const OrdersSection: React.FC<OrdersSectionProps> = ({ orders }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <section className="bottom">
      <h6 className="dashBoardTitle">سفارش ها</h6>
      <div className="table-responsive">
        <table dir="rtl">
          <thead>
          <tr>
            <th>ردیف</th>
            <th>کد</th>
            <th>تاریخ</th>
            <th>وضعیت</th>
            <th>قیمت</th>
          </tr>
          </thead>
          <tbody>
          {currentOrders.map((order, index) => (
            <tr key={order?.id}>
              <td>{indexOfFirstOrder + index + 1}</td>
              <td>
                <a href={`/order/edit/${order?.id}`}>{order?.code || 'مشاهده'}</a>
              </td>
              <td>{order?.date + ' - ' + order?.fromTime}</td>
              <td>{order?.status}</td>
              <td>{tools.formatPrice(order?.finalPrice)}</td>
            </tr>
          ))}
          {currentOrders.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">هیچ سفارشی یافت نشد</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {orders.length > ordersPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={orders.length}
          itemsPerPage={ordersPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

export default OrdersSection;
