export interface DetailButton {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: React.ComponentType<any>;
  size?: string;
  type?: "primary" | "danger";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  class?: any;
  key: string;
  isLoading: boolean;
}
