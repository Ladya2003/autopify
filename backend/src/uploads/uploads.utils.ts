import { extname } from 'path';

export const getFileExtension = (fileName: string) => {
  return extname(fileName);
};
