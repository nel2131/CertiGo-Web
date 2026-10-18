import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminSession } from '../core/admin-session';

@Component({
  selector: 'app-broadcast',
  imports: [RouterLink],
  templateUrl: './broadcast.html',
  styleUrl: './broadcast.scss',
})
export class Broadcast implements AfterViewInit {
  readonly session = inject(AdminSession);

  /** First + last initial, or a single letter when only one name is set. */
  get initials(): string {
    return this.session.initials();
  }

  urgencyOptions = ['Advisory', 'Notice', 'Urgent'];
  activeUrgency = 1;

  timingOptions = ['Now', 'Schedule'];
  activeTiming = 0;

  @ViewChild('urgencyGroup') urgencyGroup!: ElementRef<HTMLDivElement>;
  @ViewChild('timingGroup') timingGroup!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    this.moveSlider(this.urgencyGroup, this.activeUrgency);
    this.moveSlider(this.timingGroup, this.activeTiming);
  }

  setUrgency(i: number) {
    this.activeUrgency = i;
    setTimeout(() => this.moveSlider(this.urgencyGroup, i));
  }

  setTiming(i: number) {
    this.activeTiming = i;
    setTimeout(() => this.moveSlider(this.timingGroup, i));
  }

  private moveSlider(group: ElementRef<HTMLDivElement>, index: number) {
    const el = group.nativeElement;
    const slider = el.querySelector<HTMLElement>('.slider')!;
    const btn = el.querySelectorAll<HTMLButtonElement>('button')[index];
    slider.style.left = btn.offsetLeft + 'px';
    slider.style.width = btn.offsetWidth + 'px';
  }
}
