declare module 'node-thermal-printer' {
  export const printer: any;
  export const types: {
    EPSON: string;
    STAR: string;
    [key: string]: string;
  };
}
