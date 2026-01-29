import { Injectable, signal } from '@angular/core';
import { CourseStore } from '@entities/course/model/course.store';
import { cryptoSafeId } from '@shared/lib/crypto-safe-id';
import { mockDelay } from '@shared/lib/mock-request';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  createdAt: Date;
};

function tutorReply(prompt: string, courseTitle: string | null) {
  const text = prompt.trim();
  const lc = text.toLowerCase();
  const prefix = courseTitle ? `(${courseTitle}) ` : '';

  if (lc.includes('quiz')) return `${prefix}Tell me the quiz topic and I will generate 3 practice questions + solutions.`;
  if (lc.includes('test')) return `${prefix}For test prep: I can outline a 20–30 min study plan and give key examples.`;
  if (lc.includes('lesson')) return `${prefix}Which lesson? I can summarize it in 5 bullets and give 1 mini exercise.`;
  if (lc.includes('dida')) return `${prefix}Dida: short sessions, clear goal, immediate feedback. Pick one skill and we will practice.`;
  return `${prefix}What exactly is confusing: definition, example, or steps?`;
}

function initialMessages(): ChatMessage[] {
  return [
    {
      id: 'm1',
      role: 'assistant',
      content:
        'Hi! I am your AI Tutor (demo). Ask me about a lesson, quiz question, or request a short explanation + practice.',
      createdAt: new Date(),
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class AiTutorStore {
  readonly messages = signal<ChatMessage[]>(initialMessages());
  readonly input = signal('');

  constructor(private readonly courseStore: CourseStore) {}

  reset() {
    this.messages.set(initialMessages());
    this.input.set('');
  }

  async send(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const courseTitle = this.courseStore.activeCourse()?.title ?? null;
    const now = new Date();
    const userMessage: ChatMessage = { id: cryptoSafeId(), role: 'user', content: trimmed, createdAt: now };

    this.messages.update((messages) => [...messages, userMessage]);
    this.input.set('');

    await mockDelay({ delayMs: 420 });

    const assistantMessage: ChatMessage = {
      id: cryptoSafeId(),
      role: 'assistant',
      content: tutorReply(trimmed, courseTitle),
      createdAt: new Date(),
    };
    this.messages.update((messages) => [...messages, assistantMessage]);
  }
}
