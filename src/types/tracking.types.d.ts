/* tslint:disable */

declare global {
  interface Window {
    gtag?: Gtag.Gtag;
  }
}

export namespace Gtag {
  export interface Gtag {
    (...args: GtagFunctionArgs): void;
  }

  export type GtagFunctionArgs =
    | [GtagCommand, EventName | EventParams | CustomParams]
    | [GtagCommand, string, EventParams | CustomParams];

  export type GtagCommand = 'config' | 'set' | 'js' | 'event' | 'consent';

  export interface EventParams {
    [key: string]: unknown;
  }

  export interface CustomParams {
    [key: string]: unknown;
  }

  export type EventName = 'click' | 'submit' | 'purchase' | 'page_view' | 'screen_view';

  export type SendGAEventDto = {
    action: EventName;
    category: string;
    label: string;
    value?: number;
  };
}

export type GtagEvent = Gtag.SendGAEventDto;

export {};
