import { ErrorModalProps } from 'components/base/ErrorModal';

export interface IAuthData {
  id: number;
  email: string;
  player_name: string;
  access_token: string;
}

interface IApplicationState {
  authData: IAuthData | undefined;
  isOpenModal: boolean;
  modalData: ErrorModalProps;
  timer: {
    stopTime: number;
    isCounting: boolean;
  };
}

export default IApplicationState;
