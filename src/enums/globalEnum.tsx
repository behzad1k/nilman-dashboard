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
    AwaitingPayment = 'در انتظار پرداخت',
    Assigned = 'محول شده',
    InProgress = 'در حال انجام',
    Canceled = 'کنسل شده',
    Done = 'تمام شده'
  };

  export enum orderStatus  {
    Created = 'Created',
    Paid = 'Paid',
    Assigned = 'Assigned',
    AwaitingPayment = 'AwaitingPayment',
    Canceled = 'Canceled',
    Done = 'Done',
    InProgress = 'InProgress'
  };

  export enum PaymentMethods {
    card = 'card',
    ap = 'ap',
    sep = 'sep',
    zarinpal = 'zarinpal',
    credit = 'credit',
  }

  export enum PaymentMethodNames {
    card = 'کارت به کارت',
    ap = 'آسان پرداخت',
    sep = 'سامان پرداخت',
    zarinpal = 'زرین پال',
    credit = 'کیف پول',
  };

}
export default globalEnum;
