/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.mp4" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  VITE_DEFAULT_RE_ID(VITE_DEFAULT_RE_ID: any): unknown;
  readonly VITE_DEFAULT_SUPPLIER_ID: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_BASE_PORT: string;
  readonly VITE_API_BASE_IP: string;
  readonly VITE_API_BASE_DOMEN: string;
  readonly VITE_USE_MOCK: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.pdf" {
  const src: string;
  export default src;
}
