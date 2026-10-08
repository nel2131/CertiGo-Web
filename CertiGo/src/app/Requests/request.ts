import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-request',
  imports: [RouterLink],
  templateUrl: './request.html',
  styleUrl: './request.scss',
})
export class Request implements AfterViewInit {
  activeFilter = 0;
  @ViewChild('filterGroup') filterGroup!: ElementRef<HTMLDivElement>;

  sortOptions = ['Newest', 'Oldest', 'Resident Name', 'Document Type', 'Status'];
  selectedSort = 'Newest';
  sortOpen = false;

  ngAfterViewInit() {
    this.moveSlider();
  }

  setFilter(index: number) {
    this.activeFilter = index;
    setTimeout(() => this.moveSlider());
  }

  toggleSort() {
    this.sortOpen = !this.sortOpen;
  }

  selectSort(s: string) {
    this.selectedSort = s;
    this.sortOpen = false;
  }

  private moveSlider() {
    const group = this.filterGroup.nativeElement;
    const slider = group.querySelector<HTMLElement>('.slider')!;
    const btn = group.querySelectorAll<HTMLButtonElement>('.filter')[this.activeFilter];
    slider.style.left = btn.offsetLeft + 'px';
    slider.style.width = btn.offsetWidth + 'px';
  }
}
