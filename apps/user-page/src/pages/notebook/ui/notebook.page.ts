import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotebookStore } from '@features/notebook/model/notebook.store';
import { ToastService } from '@shared/ui/toast/toast.service';
import { I18nStore } from '@shared/i18n/i18n.store';

@Component({
  selector: 'page-notebook',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <section class="grid gap-5 min-h-0">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-extrabold tracking-tight text-slate-900">{{ i18n.t('heading.notebook') }}</h1>
          <div class="mt-1 text-sm font-semibold text-slate-500">{{ i18n.t('message.notebook_intro') }}</div>
        </div>
        <div class="flex gap-2 flex-wrap">
          <button
            class="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 hover:bg-slate-50"
            type="button"
            (click)="goToTutor()"
          >
            {{ i18n.t('action.ask_ai_tutor') }}
          </button>
          <button
            class="h-11 rounded-2xl bg-emerald-600 px-4 text-sm font-bold text-white hover:bg-emerald-500"
            type="button"
            (click)="createNote()"
          >
            {{ i18n.t('action.new_note') }}
          </button>
        </div>
      </div>

      <div class="grid gap-3 lg:grid-cols-[320px_1fr] min-h-0">
        <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-0">
          <div class="flex items-center justify-between gap-3 px-5 py-4">
            <div class="text-sm font-extrabold text-slate-900">{{ i18n.t('label.notes') }}</div>
            <div class="text-sm font-extrabold text-slate-500">{{ notes().length }}</div>
          </div>
          <div class="px-3 pb-4 overflow-auto min-h-0 grid gap-2">
            @for (note of notes(); track note.id) {
              <button
                class="w-full text-left rounded-2xl border border-slate-200 bg-white px-4 py-3 hover:bg-slate-50"
                [class.border-emerald-200]="note.id === activeNoteId()"
                [class.bg-emerald-50]="note.id === activeNoteId()"
                type="button"
                (click)="selectNote(note.id)"
              >
                <div class="text-sm font-extrabold text-slate-900">{{ note.title }}</div>
                <div class="mt-1 text-xs font-extrabold text-slate-400">{{ note.updatedAt | date: 'MMM dd, yyyy' }}</div>
              </button>
            }
          </div>
        </div>

        <div class="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-0">
          @if (activeNote()) {
            <div class="p-5 grid gap-4 min-h-0">
              <label class="grid gap-1">
                <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.title') }}</span>
                <input
                  class="h-11 rounded-2xl border border-slate-200 px-4 font-semibold outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  type="text"
                  [ngModel]="editorTitle()"
                  (ngModelChange)="editorTitle.set($event)"
                />
              </label>

              <label class="grid gap-1 min-h-0">
                <span class="text-xs font-extrabold text-slate-500">{{ i18n.t('label.content') }}</span>
                <textarea
                  class="min-h-[220px] flex-1 rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                  [ngModel]="editorContent()"
                  (ngModelChange)="editorContent.set($event)"
                ></textarea>
              </label>

              <div class="flex justify-end gap-2 flex-wrap">
                <button
                  class="h-11 rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 hover:bg-rose-100"
                  type="button"
                  (click)="deleteNote(activeNote()!.id)"
                >
                  {{ i18n.t('action.delete') }}
                </button>
                <button
                  class="h-11 rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white hover:bg-slate-800"
                  type="button"
                  (click)="saveNote()"
                >
                  {{ i18n.t('action.save') }}
                </button>
              </div>
            </div>
          } @else {
            <div class="p-10 grid place-items-center">
              <div class="text-base font-extrabold text-slate-900">{{ i18n.t('message.no_note_selected') }}</div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class NotebookPage {
  private readonly router = inject(Router);
  private readonly notebookStore = inject(NotebookStore);
  private readonly toast = inject(ToastService);
  readonly i18n = inject(I18nStore);

  readonly notes = this.notebookStore.notes;
  readonly activeNoteId = this.notebookStore.activeNoteId;
  readonly activeNote = this.notebookStore.activeNote;
  readonly editorTitle = this.notebookStore.editorTitle;
  readonly editorContent = this.notebookStore.editorContent;

  goToTutor() {
    void this.router.navigateByUrl('/ai-tutor');
  }

  selectNote(noteId: string) {
    this.notebookStore.selectNote(noteId);
  }

  async createNote() {
    await this.notebookStore.createNote();
    this.toast.show(this.i18n.t('toast.note_created'));
  }

  async saveNote() {
    await this.notebookStore.saveNote();
    this.toast.show(this.i18n.t('toast.note_saved'));
  }

  async deleteNote(noteId: string) {
    await this.notebookStore.deleteNote(noteId);
    this.toast.show(this.i18n.t('toast.note_deleted'));
  }
}
