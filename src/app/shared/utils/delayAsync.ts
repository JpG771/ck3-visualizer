export const delayFunction = (myFunction: Function, args: any[]) =>
  new Promise<any>((resolve, _reject) => {
    setTimeout(() => {
      resolve(myFunction(...args));
    }, 1000)
  });
