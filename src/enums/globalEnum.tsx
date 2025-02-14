namespace globalEnum {
  export enum roles  {
    SUPER_ADMIN = 'SUPER_ADMIN',
    OPERATOR = 'OPERATOR',
    WORKER = 'WORKER',
    USER = 'USER',
  };

  export enum orderStatusNames  {
    Created = 'سبد خرید',
    Paid = 'پرداخت شده',
    Assigned = 'محول شده',
    InProgress = 'در حال انجام',
    Canceled = 'کنسل شده',
    Done = 'تمام شده'
  };

  export enum orderStatus  {
    Created = 'Created',
    Paid = 'Paid',
    Assigned = 'Assigned',
    Canceled = 'Canceled',
    Done = 'Done',
    InProgress = 'InProgress'
  };
}
export default globalEnum;
