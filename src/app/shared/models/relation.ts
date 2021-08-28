import { Ck3Service } from 'src/app/core/services/ck3.service';
import { Ck3Date } from './base';

export interface Hook {
  type: string;
  gold: number;
  expiration_date: Ck3Service;
}

export interface Relation {
  first: number;
  second: number;

  alliances?: {
    data: any[];
  };
  active_hook_0?: Hook;
  active_hook_1?: Hook;
  cooldown_against_recipient_0?: {
    [key: string]: Ck3Date
  };
  cooldown_against_recipient_1?:  {
    [key: string]: Ck3Date
  };
}