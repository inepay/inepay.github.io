declare module '@assemblyscript/loader' {
  export function instantiate<T>(...args: any[]): Promise<T>;
}
