export interface ISidebarNavTab {
    name: string;
    label: string;
    icon: string;
    isSvgIcon?: boolean;
    type: 'link' | 'button' | 'href';
    url: string;
    disabled: boolean;
  }
  