export interface IComment {
  _id: string;
  carId?: string;
  sellerId?: string;
  authorId: string;
  text: string;
  createdAt: Date;
}

export enum CommentType {
  Seller = 'seller',
  Car = 'car',
}
