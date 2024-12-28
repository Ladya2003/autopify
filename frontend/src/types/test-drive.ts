import { Car } from './car';
import { UserType } from './user';

export enum TestDriveStatus {
  Free = 'free',
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Canceled = 'canceled',
}

export type TestDrive = {
  _id: string;
  carId: string;
  userId?: string;
  authorId: string;
  testDriveDatetime: string;
  status: TestDriveStatus;
  description?: string;
  author?: UserType;
  car?: Car;
};
