import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-residents',
  imports: [RouterLink],
  templateUrl: './residents.html',
  styleUrl: './residents.scss',
})
export class Residents {
  zoneOptions = ['All Zones', 'Zone 1', 'Zone 2', 'Zone 3', 'Zone 5', 'Zone 8'];
  selectedZone = 'All Zones';
  zoneOpen = false;

  exportOptions = ['Export as CSV', 'Export as PDF', 'Print List'];
  exportOpen = false;

  toggleZone() {
    this.zoneOpen = !this.zoneOpen;
  }

  selectZone(z: string) {
    this.selectedZone = z;
    this.zoneOpen = false;
  }

  toggleExport() {
    this.exportOpen = !this.exportOpen;
  }

  selectExport(e: string) {
    this.exportOpen = false;
  }
}
