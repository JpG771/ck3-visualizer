import { Ck3Date, YesNo } from './base';

export interface WarParticipant {
  character: number;
  /** 
   * 3 value array. Ex: ["1419", "1069", "0"]
   * Attack / Defence / Siege ?
   */
  contribution: number[];
  last_action: Ck3Date;
}

export interface War {
  attacker: {
    participants: {
      data: WarParticipant[];
    }
  };
  battle_results: {
    data: any[];
  };
  called_to_war: number[];
  casus_belli: {
    attacker: number;
    claimant: number;
    defender: number;
    targeted_titles: number[];
    type: string;
  };
  defender: {
    controls_all: YesNo;
    participants: {
      data: WarParticipant[];
    };
    ticking_war_score: number;
  };
  /** Strange format (CK3 Format) */
  name: string;
  start_date: Ck3Date;
}