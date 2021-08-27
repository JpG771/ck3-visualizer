import { Ck3Date, YesNo } from './base'

export interface Character {
  first_name: string;
  birth?: Ck3Date;
  female?: YesNo;
  was_playable?: YesNo;
  culture?: number;
  faith?: number;
  sexuality?: string;
  dynasty_house?: number;
  skill?: number[];
  mass?: number;
  dna?: string;
  traits?: number[];
  prowess_age?: number;
  family_data?: {
    child: number | number[];
  }
  weight?: {
    base: number;
    current: number;
    target?: number;
  }
}

export interface DeadCharacter extends Character {
  dead_data: {
    date: Ck3Date;
    domain?: number | number[];
    reason?: string;
    liege?: number;
    liege_title?: number;
    government?: string;
  }
}