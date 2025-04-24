import React, { useState } from 'react';
import moment from 'jalali-moment';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { popupSlice } from '../../../services/reducers';
import WorkerOffModal from '../../../layouts/Modal/WorkerOffModal';
import restApi from '../../../services/restApi';
import endpoints from '../../../config/endpoints';
import { IWorkerOff } from '../../../types/types';
import Pagination from '../../../layouts/Pagination';
import { setLoading } from '../../../services/reducers/homeSlice';

interface WorkerOffsSectionProps {
  workerOffs: Record<string, IWorkerOff[]>;
  userId?: string;
  onDelete: () => Promise<void>;
}

const WorkerOffsSection: React.FC<WorkerOffsSectionProps> = ({ workerOffs, userId, onDelete }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const daysPerPage = 5;

  const sortedDays = Object.entries(workerOffs)
  .sort(([key1, _], [key2, __]) =>
    moment(key2, 'jYYYY/jMM/jDD').unix() - moment(key1, 'jYYYY/jMM/jDD').unix()
  );

  const indexOfLastDay = currentPage * daysPerPage;
  const indexOfFirstDay = indexOfLastDay - daysPerPage;
  const currentDays = sortedDays.slice(indexOfFirstDay, indexOfLastDay);

  const deleteWorkerOff = async (workerOff: IWorkerOff) => {
    const result = await Swal.fire({
      title: 'آیا مطمئن هستید؟',
      text: `تایم ${workerOff.fromTime} - ${workerOff.toTime} در تاریخ ${workerOff.date} حذف شود؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'بله، حذف شود',
      cancelButtonText: 'انصراف'
    });

    if (result.isConfirmed) {
      dispatch(setLoading(true));

      try {
        const res = await restApi(endpoints.user.workerOff + workerOff.id).delete({});

        if (res.code === 200) {
          await onDelete();
          Swal.fire({
            title: 'موفق',
            text: 'تایم مشغولی با موفقیت حذف شد',
            icon: 'success',
            confirmButtonText: 'متوجه شدم',
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
          text: 'خطایی در حذف تایم مشغولی رخ داد',
          icon: 'error',
          confirmButtonText: 'متوجه شدم'
        });
      } finally {
        dispatch(setLoading(false));
      }
    }
  };

  return (
    <section className="bottom">
      <h6 className="dashBoardTitle">تایم های مشغولی</h6>
      <span
        className="dashboardHeader keepRight clickable"
        onClick={() => dispatch(popupSlice.middle(<WorkerOffModal userId={userId} />))}
      >
        افزودن
      </span>
      <div className="table-responsive">
        <table dir="rtl" className="worker-offs-table">
          <thead>
          <tr>
            <th>تاریخ</th>
            <th colSpan={5}>سانس ها</th>
          </tr>
          </thead>
          <tbody>
          {currentDays.map(([date, slots]) => {
            const sortedSlots = [...slots].sort((a, b) => a?.toTime - b.toTime).sort((a, b) => a?.fromTime - b.fromTime);

            return (
              <tr key={date}>
                <td className="date-cell">{date}</td>
                <td className="slots-cell">
                  <div className="slots-container">
                    {sortedSlots.map(slot => (
                      <div key={slot.id} className="worker-off-slot">
                        <div className="slot-header">
                            <span className="slot-time">
                              {slot.fromTime} - {slot.toTime}
                            </span>
                          <button
                            className="delete-button"
                            onClick={async (e) => {
                              e.preventDefault();
                              await deleteWorkerOff(slot);
                            }}
                            title="حذف"
                          >
                            ×
                          </button>
                        </div>
                        <div className="slot-order">
                          {slot.order?.id ? (
                            <a href={`/order/edit/${slot.order?.id}`}>
                              {slot.order?.code}
                            </a>
                          ) : (
                            <span className="no-order">-</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
          {currentDays.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">هیچ تایم مشغولی یافت نشد</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {sortedDays.length > daysPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={sortedDays.length}
          itemsPerPage={daysPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  );
};

export default WorkerOffsSection;
