import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorModalProps } from 'components/base/ErrorModal';

import IApplicationState, { IAuthData } from './types';

const initialState: IApplicationState = {
  authData: undefined,
  isOpenModal: false,
  modalData: {
    title: '',
    description: '',
    okButtonText: 'OK',
    onOk: () => console.log(),
  },
  timer: {
    stopTime: 0,
    isCounting: true,
  },
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const ApplicationState = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuthData(
      state: IApplicationState,
      action: PayloadAction<IAuthData | undefined>
    ) {
      state.authData = action.payload;
    },
    openModal(state: IApplicationState) {
      state.isOpenModal = true;
    },
    closeModal(state: IApplicationState) {
      state.isOpenModal = false;
    },
    setModalData(
      state: IApplicationState,
      action: PayloadAction<ErrorModalProps>
    ) {
      state.modalData = action.payload;
    },
    updateStopTime(state: IApplicationState, action: PayloadAction<number>) {
      state.timer.stopTime = action.payload;
    },
    stopTime(state: IApplicationState, action: PayloadAction<boolean>) {
      state.timer.isCounting = action.payload;
    },
  },
});

export const {
  setAuthData,
  openModal,
  closeModal,
  setModalData,
  updateStopTime,
  stopTime,
} = ApplicationState.actions;

export default ApplicationState.reducer;
