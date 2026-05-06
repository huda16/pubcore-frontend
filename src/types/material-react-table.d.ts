type TabOption = {
  label: string;
  value: string | number | boolean | null;
};

type TabsConfig<T> = {
  property: QueryKey<T>;
  options: TabOption[];
  hideAllTab?: boolean;
};
