import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IndexedDBService } from './services/indexed-db.service';
import requirements from '../../public/requirements.json';
import { Requirements } from '../models/Requirements';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'KappaRequirements';
  requirements = requirements;
  savedRequirements: Requirements = {
    quests: [],
    items: [],
    level: 0,
  };
  questsInput = '';
  itemsInput = '';
  completedQuestsInput = '';
  ownedItemsInput = '';

  constructor(private db: IndexedDBService) {}

  ngOnInit(): void {
    this.db.getSavedRequirements();

    this.db.requirements.subscribe({
      next: (savedRequirements) => {
        this.savedRequirements = savedRequirements;
      },
    });
  }

  get completedQuests() {
    const quests = this.savedRequirements.quests;
    if (quests) {
      return quests;
    }

    return [];
  }

  get ownedItems() {
    const items = this.savedRequirements.items;
    if (items) {
      return items;
    }

    return [];
  }

  get filteredQuests() {
    return this.requirements.quests.filter((quest) =>
      quest.toLowerCase().includes(this.questsInput.toLowerCase()),
    );
  }

  get filteredItems() {
    return this.requirements.items.filter((quest) =>
      quest.toLowerCase().includes(this.itemsInput.toLowerCase()),
    );
  }

  get filteredCompletedQuests() {
    return this.savedRequirements.quests.filter((quest) =>
      quest.toLowerCase().includes(this.completedQuestsInput.toLowerCase()),
    );
  }

  get filteredOwnedItems() {
    return this.savedRequirements.items.filter((quest) =>
      quest.toLowerCase().includes(this.ownedItemsInput.toLowerCase()),
    );
  }

  completeQuest(quest: string) {
    this.savedRequirements.quests.push(quest);
    this.db.saveRequirements(this.savedRequirements);
  }

  receiveItem(item: string) {
    this.savedRequirements.items.push(item);
    this.db.saveRequirements(this.savedRequirements);
  }

  revertCompleteQuest(quest: string) {
    this.savedRequirements.quests.splice(
      this.savedRequirements.quests.indexOf(quest),
      1,
    );
    this.db.saveRequirements(this.savedRequirements);
  }

  revertReceiveItem(item: string) {
    this.savedRequirements.items.splice(
      this.savedRequirements.items.indexOf(item),
      1,
    );
    this.db.saveRequirements(this.savedRequirements);
  }
}
