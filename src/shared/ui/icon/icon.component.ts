import { Component, Input } from '@angular/core';
import { IconName } from './icon.types';

@Component({
  selector: 'shared-icon',
  standalone: true,
  template: `
    <span class="inline-flex items-center justify-center leading-none shrink-0 [&_svg]:block" aria-hidden="true">
      @switch (name) {
        @case ('logo') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M12 2.5c5.25 0 9.5 4.25 9.5 9.5S17.25 21.5 12 21.5 2.5 17.25 2.5 12 6.75 2.5 12 2.5Z"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M9 12.25c1.5-3.25 4.5-4.75 7-5-.25 2.75-1.75 5.75-5 7.25-1.5.75-3 1-4.25.9.15-1 .55-1.8 1.25-3.15Z"
              fill="currentColor"
            />
          </svg>
        }
        @case ('dashboard') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M4 11.5 12 4l8 7.5v8a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19.5v-8Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <path
              d="M9.5 21v-6.25c0-.7.55-1.25 1.25-1.25h2.5c.7 0 1.25.55 1.25 1.25V21"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        }
        @case ('courses') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M6 4.5h10.5A2.5 2.5 0 0 1 19 7v12.5A2.5 2.5 0 0 1 16.5 22H6A2.5 2.5 0 0 1 3.5 19.5V7A2.5 2.5 0 0 1 6 4.5Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M7 4.5V22"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        }
        @case ('lessons') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M6 4.5h12A2.5 2.5 0 0 1 20.5 7v12.5A2.5 2.5 0 0 1 18 22H6A2.5 2.5 0 0 1 3.5 19.5V7A2.5 2.5 0 0 1 6 4.5Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M7.5 8h9M7.5 12h9M7.5 16h6"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        }
        @case ('quizzes') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M7 4h10v17H7A2.5 2.5 0 0 1 4.5 18.5v-12A2.5 2.5 0 0 1 7 4Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="m8 12 2 2 5-6"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        @case ('tests') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M7 4h10v17H7A2.5 2.5 0 0 1 4.5 18.5v-12A2.5 2.5 0 0 1 7 4Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M8 8h7M8 12h7M8 16h5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        }
        @case ('downloads') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path d="M12 3v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path
              d="m7 11 5 5 5-5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M5 21h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        }
        @case ('notebook') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M7 4h10A2.5 2.5 0 0 1 19.5 6.5v13A2.5 2.5 0 0 1 17 22H7A2.5 2.5 0 0 1 4.5 19.5v-13A2.5 2.5 0 0 1 7 4Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path d="M8 8h8M8 12h8M8 16h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        }
        @case ('ai_tutor') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M12 2 13.4 6.6 18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <path
              d="M19 13l.9 2.6L22.5 16 19.9 16.4 19 19l-.9-2.6L15.5 16l2.6-.4L19 13Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
          </svg>
        }
        @case ('dida') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M12 3 14 7.5 19 9l-5 1.5L12 15l-2-4.5L5 9l5-1.5L12 3Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linejoin="round"
            />
            <path d="M5 21h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        }
        @case ('profile') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="1.8" />
            <path
              d="M4.5 21a7.5 7.5 0 0 1 15 0"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        }
        @case ('security') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M7.5 11V8.5A4.5 4.5 0 0 1 12 4a4.5 4.5 0 0 1 4.5 4.5V11"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="M6.5 11h11A2.5 2.5 0 0 1 20 13.5v6A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5v-6A2.5 2.5 0 0 1 6.5 11Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
          </svg>
        }
        @case ('calendar') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M6.5 5h11A2.5 2.5 0 0 1 20 7.5v12A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5v-12A2.5 2.5 0 0 1 6.5 5Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path d="M7 3v4M17 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M4 9h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        }
        @case ('play') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M12 21.5a9.5 9.5 0 1 1 0-19 9.5 9.5 0 0 1 0 19Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor" />
          </svg>
        }
        @case ('check') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="m20 6-11 11-5-5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        @case ('circle') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M12 21.5a9.5 9.5 0 1 1 0-19 9.5 9.5 0 0 1 0 19Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
          </svg>
        }
        @case ('bell') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A5.517 5.517 0 0 1 19 11.5V8a7 7 0 1 0-14 0v3.5c0 1.46-.53 2.87-1.738 3.826Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.268 21a2 2 0 0 0 3.464 0"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        }
        @case ('bell_off') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M8.633 3.117A7 7 0 0 1 12 2.5a7 7 0 0 1 7 7v3.5c0 1.46.53 2.87 1.738 3.826"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.257 6.257A6.96 6.96 0 0 0 5 9.5V13c0 1.46-.53 2.87-1.738 3.826A1 1 0 0 0 4 18h13"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.5 20a2.5 2.5 0 0 0 5 0"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path d="M2 2l20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        }
        @case ('sun') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.8" />
            <path d="M12 2.5v2.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M12 19.25v2.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M4.75 4.75l1.6 1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M17.65 17.65l1.6 1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M2.5 12h2.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M19.25 12h2.25" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M4.75 19.25l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            <path d="M17.65 6.35l1.6-1.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        }
        @case ('moon') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M21 12.5A8.5 8.5 0 1 1 11.5 3a7 7 0 0 0 9.5 9.5Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        @case ('eye') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8" />
          </svg>
        }
        @case ('eye_off') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M9.879 9.879A3 3 0 0 0 12 15a3 3 0 0 0 2.121-.879"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.228 6.228A9.964 9.964 0 0 0 2.458 12c1.274 4.057 5.065 7 9.542 7a9.964 9.964 0 0 0 5.248-1.52"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.73 5.073A9.964 9.964 0 0 1 12 5c4.477 0 8.268 2.943 9.542 7a9.965 9.965 0 0 1-4.132 5.056"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M3 3l18 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        }
        @case ('copy') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.8" />
            <path
              d="M5 15V5a2 2 0 0 1 2-2h10"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        @case ('search') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              stroke-width="1.8"
            />
            <path
              d="M16.5 16.5 21 21"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        }
        @case ('chevron_down') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="m7 10 5 5 5-5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
        @case ('logout') {
          <svg viewBox="0 0 24 24" [attr.width]="size" [attr.height]="size" fill="none">
            <path
              d="M10 17H7a2.5 2.5 0 0 1-2.5-2.5v-7A2.5 2.5 0 0 1 7 5h3"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
            <path
              d="M15 7 19 12l-4 5"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M19 12H10"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
            />
          </svg>
        }
      }
    </span>
  `,
})
export class IconComponent {
  @Input({ required: true }) name!: IconName;
  @Input() size = 18;
}
