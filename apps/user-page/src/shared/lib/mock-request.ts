export type MockRequestOptions = {
  delayMs?: number;
};

export function mockDelay(options: MockRequestOptions = {}): Promise<void> {
  const delayMs = options.delayMs ?? 250;
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

