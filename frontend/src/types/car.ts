export interface ICarSeller {
  profilePicture?: string;
  nickname?: string;
  email: string;
  id: string;
}

export interface Car {
  _id: string;
  brand: string;
  model: string;
  year: number;
  transmission: string;
  engineSize: number;
  fuelType: string;
  mileage: number;
  price: number;
  description: string;
  images?: string[];
  views?: number;
  rating?: number;
  sellerId: string;
  testDriveAvailability: string[]; // Доступное время для тест-драйва
  seller: ICarSeller;
}

export enum TransmissionType {
  Automatic = 'Автомат',
  Manual = 'Ручная',
}

export enum FuelType {
  Petrol = 'Бензин',
  Diesel = 'Дизель',
}
