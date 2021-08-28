import { OneToHundread, RGBValue } from './base';

export interface Religion {
  template: string;
  tag: string;
  graphical_faith: string;
  piety_icon_group: string;
  doctrine_background_icon: string;
  family: string;
  faiths: number[];
}

export interface Faith {
  template: string;
  tag: string;
  color: RGBValue;
  icon: string;
  texticon: string;
  graphical_faith: string;
  fervor: OneToHundread;
  religious_head: string;
  doctrine: string[];
  religion: number;
  holy_sites: number[];
}