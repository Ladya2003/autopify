import { DEFAULT_AVATAR } from '../../types/user';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const calculateAge = (birthYear: number): number => {
  return new Date().getFullYear() - birthYear;
};

// TODO: low priority - change function name
export const parseAvatarURL = (inAvatarURL?: string) => {
  if (inAvatarURL) {
    return inAvatarURL.includes('http')
      ? inAvatarURL
      : `http://localhost:3000/assets/images/profile/${inAvatarURL
          ?.split('\\')
          .pop()}`;
  }

  return DEFAULT_AVATAR;
};
