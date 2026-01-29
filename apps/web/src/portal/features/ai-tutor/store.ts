import { createStore, useStore } from "@/portal/store";
import { cryptoSafeId } from "@/portal/lib/crypto-safe-id";
import { mockDelay } from "@/portal/lib/mock-request";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  createdAt: Date;
};

function tutorReply(prompt: string, courseTitle: string | null) {
  const text = prompt.trim();
  const lc = text.toLowerCase();
  const prefix = courseTitle ? `(${courseTitle}) ` : "";

  if (lc.includes("quiz")) return `${prefix}Tell me the quiz topic and I will generate 3 practice questions + solutions.`;
  if (lc.includes("test")) return `${prefix}For test prep: I can outline a 20–30 min study plan and give key examples.`;
  if (lc.includes("lesson")) return `${prefix}Which lesson? I can summarize it in 5 bullets and give 1 mini exercise.`;
  if (lc.includes("dida")) return `${prefix}Dida: short sessions, clear goal, immediate feedback. Pick one skill and we will practice.`;
  return `${prefix}What exactly is confusing: definition, example, or steps?`;
}

function initialMessages(): ChatMessage[] {
  return [
    {
      id: "m1",
      role: "assistant",
      content:
        "Hi! I am your AI Tutor (demo). Ask me about a lesson, quiz question, or request a short explanation + practice.",
      createdAt: new Date()
    }
  ];
}

const store = createStore<{ messages: ChatMessage[]; input: string }>({
  messages: initialMessages(),
  input: ""
});

export function useAiTutorMessages() {
  return useStore(store, (state) => state.messages);
}

export function useAiTutorInput() {
  return useStore(store, (state) => state.input);
}

export function setAiTutorInput(value: string) {
  store.setState((current) => ({ ...current, input: value }));
}

export function resetAiTutor() {
  store.setState({ messages: initialMessages(), input: "" });
}

export async function sendAiTutorMessage(prompt: string, courseTitle: string | null) {
  const trimmed = prompt.trim();
  if (!trimmed) return;
  const now = new Date();
  const userMessage: ChatMessage = { id: cryptoSafeId(), role: "user", content: trimmed, createdAt: now };

  store.setState((current) => ({ ...current, messages: [...current.messages, userMessage], input: "" }));
  await mockDelay({ delayMs: 420 });

  const assistantMessage: ChatMessage = {
    id: cryptoSafeId(),
    role: "assistant",
    content: tutorReply(trimmed, courseTitle),
    createdAt: new Date()
  };
  store.setState((current) => ({ ...current, messages: [...current.messages, assistantMessage] }));
}
