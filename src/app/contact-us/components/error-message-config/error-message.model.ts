export interface IErrorMessage {
  readonly [key: string]: string;
  // @ts-ignore
  readonly minlength?: string;
  // @ts-ignore
  readonly maxlength?: string;
  // @ts-ignore
  readonly mask?: string;
  //@ts-ignore
  readonly pattern?: string;
  //@ts-ignore
  readonly required?: string;
}
