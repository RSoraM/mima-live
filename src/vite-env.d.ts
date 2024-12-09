/// <reference types="vite/client" />
interface Algorithm {
  type: string;
  name: string;
  path: string;
  component: DefineComponent;
}

interface SelectOption<T = any> {
  label: string;
  value: T;
  disable?: boolean;
}
