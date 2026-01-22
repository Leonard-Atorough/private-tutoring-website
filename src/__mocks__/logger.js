export function createMockLogger(vi) {
  return {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

export default function getMockLogger(vi) {
  return createMockLogger(vi);
}
