/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IEntityStaticMethods {
  create(
    props: any,
    idGenerator?: () => string,
    hasher?: (password: string) => Promise<string>,
  ): any;

  hydrate(props: any): any;
}
