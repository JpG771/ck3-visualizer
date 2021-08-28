export const toTitleCase = (myStr: string) => {
  if (myStr) {
    return myStr
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');
  }
  return undefined;
};
