import { IWorkerOff } from '../types/types';

export const formatWorkerOffs = (workerOffs: IWorkerOff[]): Record<string, IWorkerOff[]> => {
  const formattedData: Record<string, IWorkerOff[]> = {};

  workerOffs.forEach(workerOff => {
    if (!formattedData[workerOff.date]) {
      formattedData[workerOff.date] = [];
    }
    formattedData[workerOff.date].push(workerOff);
  });

  return formattedData;
};