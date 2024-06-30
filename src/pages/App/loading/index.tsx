"use client"
import { useAppSelector } from '../../../services/store';
import LoadingBody from './LoadingBody';

export function Loading() {
  const loading = useAppSelector((state) => state.homeReducer.loading);

  return loading ? <LoadingBody /> : null
}
