export const sortArrayByNumber =
  (getNumberElement: (element: any) => number) => (itemA: any, itemB: any) =>
    getNumberElement(itemA) - getNumberElement(itemB);
