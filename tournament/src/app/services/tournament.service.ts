import { Injectable, EventEmitter } from '@angular/core';

import { BROWSER_STORAGE, BrowserStorageService } from './browser-storage.service';

import { Region } from '../models/region';
import { Selected } from '../models/selected';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root'
})

export class TournamentService {
  static selectedRegion = new EventEmitter();
  static updateRegions = new EventEmitter();
  static generatedTournament = new EventEmitter();

  regions: Region[] = [
    {
      id:1,
      name:"Águas de Sentina",
      icon: "bilgewater_crest_icon.png",
      inTournament: false
    },
    {
      id:2,
      name:"Bandópolis",
      icon: "bandle_city_crest_icon.png",
      inTournament: false
    },
    {
      id:3,
      name:"Demacia",
      icon: "demacia_crest_icon.png",
      inTournament: false
    },
    {
      id:4,
      name:"Freljord",
      icon: "freljord_crest_icon.png",
      inTournament: false
    },
    {
      id:5,
      name:"Ionia",
      icon: "iona_crest_icon.png",
      inTournament: false
    },
    {
      id:6,
      name:"Noxus",
      icon: "noxus_crest_icon.png",
      inTournament: false
    },
    {
      id:7,
      name:"Piltover",
      icon: "piltover_crest_icon.png",
      inTournament: false
    },
    {
      id:8,
      name:"Zaun",
      icon: "zaun_crest_icon.png",
      inTournament: false
    }
  ]

  selected: Selected = {
    1: null,
    2: null,
    3: null, 
    4: null
  };

  result: Result;

  constructor(private localStorageService: BrowserStorageService) {}

  getRegions() {
    return this.regions;
  }

  addSelectedRegion(region: Region) {
    const emptyPosition = Object.keys(this.selected).find(position => this.selected[position] === null);
    if(emptyPosition !== undefined){
      this.regions = this.regions.map(el =>
        el.id === region.id
          ? { ...el, inTournament: true }
          : el
      );
      TournamentService.updateRegions.emit(this.regions);
      this.selected = {...this.selected, [emptyPosition]: region};
      TournamentService.selectedRegion.emit(this.selected);
    }
  }

  removeSelectedRegion(region: Region, position: number) {
    this.regions = this.regions.map(el =>
      el.id === region.id
      ? { ...el, inTournament: false }
      : el
    );
    this.selected = {...this.selected, [position]: null};
    TournamentService.selectedRegion.emit(this.selected);
    TournamentService.updateRegions.emit(this.regions);
  }

  generateTournament(selected: Selected){
    const semifinal1 = selected[Math.round(Math.random()) + 1];
    const semifinal2 = selected[Math.round(Math.random()) + 3];
    const semifinal = [semifinal1, semifinal2];
    const champion = semifinal[Math.round(Math.random())];
    this.result = {
      semifinal1,
      semifinal2,
      champion 
    };
    this.localStorageService.set("champion", champion.name);
    TournamentService.generatedTournament.emit(this.result);
  }
  
  resetTournament(selected: Selected, result: Result){
    this.regions = this.regions.map(el => ({ ...el, inTournament: false }));
    Object.keys(selected).forEach(key => selected[key] = null);
    Object.keys(result).forEach(key => result[key] = null);
    TournamentService.updateRegions.emit(this.regions);
    TournamentService.selectedRegion.emit(this.selected);
    TournamentService.generatedTournament.emit(this.result);
  }
}
