export enum AuthRole {
  Guest = 'guest',
  User = 'user',
  Seller = 'seller',
  Admin = 'admin',
}

export type UserType = {
  id: string;
  email: string;
  role: AuthRole;
  nickname: string;
  profilePicture: string;
  description: string;
};

export const DEFAULT_AVATAR =
  'https://static.vecteezy.com/system/resources/previews/020/168/700/non_2x/faceless-male-silhouette-empty-state-avatar-icon-businessman-editable-404-not-found-persona-for-ux-ui-design-cartoon-profile-picture-with-red-dot-colorful-website-mobile-error-user-badge-vector.jpg';
