import { Ck3Date } from '../models/base';

export const dateToObject = (
  ck3Date: Ck3Date
): { year: number; month: number; day: number } | undefined => {
  if (ck3Date) {
    const firstDot = ck3Date.indexOf('.');
    const secondDot = ck3Date.indexOf('.', firstDot + 1);
    const year = parseInt(ck3Date.substring(0, firstDot), 10);
    const month = parseInt(ck3Date.substring(firstDot + 1, secondDot), 10);
    const day = parseInt(ck3Date.substring(secondDot + 1), 10);
    return { year, month, day };
  }
  return undefined;
};
