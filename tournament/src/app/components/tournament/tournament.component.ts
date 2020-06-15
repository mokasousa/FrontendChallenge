import { Component, OnInit } from '@angular/core';

import { TournamentService } from '../../services/tournament.service';
import { Region } from '../../models/region';
import { Selected } from 'src/app/models/selected';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})

export class TournamentComponent implements OnInit {
  selected: Selected = {
    1: null,
    2: null,
    3: null, 
    4: null
  };

  result: {
    semifinal1: Region|null;
    semifinal2: Region|null;
    champion: Region|null;
  } = {
    semifinal1: null,
    semifinal2: null,
    champion: null
  }

  constructor(private tournamentService: TournamentService) {
    TournamentService.generatedTournament.subscribe(
      result => this.result = result
    );
  }

  ngOnInit(): void {
    TournamentService.selectedRegion.subscribe(
      selected => this.selected = selected
    );
  }

  onRemove(selectedRegion: Region, position: number): void {
    this.tournamentService.removeSelectedRegion(selectedRegion, position);
  }

  onGenerate(selectedTournament: Selected): void {
    this.tournamentService.generateTournament(selectedTournament);
  }

  onReset(selected: Selected, result): void {
    this.tournamentService.resetTournament(this.selected, this.result);
  }

  showButton(): boolean {
    return Object.values(this.result).some(i => i === null);
  }

  disableButton(): boolean {
    return Object.values(this.selected).some(i => i === null);
  }
}
