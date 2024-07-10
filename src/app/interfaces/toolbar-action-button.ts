export interface IToolbarActionButton {
    name: string;
    tooltipText?: string;
    icon: string;
    isSvgIcon?: boolean;
    isSimpleButton?: boolean;
    simpleButtonText?: string;
    cssClass?: string;
    disabled?: boolean;
    visible?: boolean;
    children?: IToolbarActionButton[];
    action?(...params: any[]): void;
  }
  