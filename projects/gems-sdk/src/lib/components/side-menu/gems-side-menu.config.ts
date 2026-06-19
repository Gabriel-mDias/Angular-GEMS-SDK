export interface GemsSideMenuItem {
  label: string;
  icon?: string;
  route?: string;
  roles?: string[];
  children?: GemsSideMenuItem[];
  isExpanded?: boolean;
}

export interface GemsSideMenuConfig {
  headerLogoUrl?: string;
  headerTitle?: string;
  items: GemsSideMenuItem[];
}
