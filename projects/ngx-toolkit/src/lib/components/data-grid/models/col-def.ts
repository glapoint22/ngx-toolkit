import { InjectionToken } from "@angular/core";

export interface ColDef {
    field: string;
    width: number;
    component?: any;
    cellRendererParams?: any;
    cellRendererSelector?: CellRendererSelectorFunc<any, any>;
    cellStyle?: CellStyle | CellStyleFunc<any, any>;
}



export const COMPONENT_PARAMS = new InjectionToken('ComponentParams');

interface CellRendererSelectorFunc<TData = any, TValue = any> {
    (params: any) : any
}


interface CellStyle {
    [cssProperty: string]: string  |  number;
  }
  
  interface CellStyleFunc<TData = any, TValue = any> {
      (cellClassParams: any) : CellStyle | null | undefined
  }
  
  