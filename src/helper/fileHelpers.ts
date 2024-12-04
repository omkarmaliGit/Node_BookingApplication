import fs from 'fs';

export const readData = <T>(file: string): T => {
  const data = fs.readFileSync(file, 'utf-8');
  return JSON.parse(data) as T;
};

export const writeData = <T>(file: string, data: T): void => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};
