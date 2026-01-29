export async function mockDelay({ delayMs = 250 }: { delayMs?: number } = {}) {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

