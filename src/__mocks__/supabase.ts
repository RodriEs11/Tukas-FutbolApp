import { vi } from 'vitest';

// Chainable query builder mock
export function createMockQueryBuilder(data: unknown = null, error: unknown = null) {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};

  const methods = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike',
    'is', 'in', 'contains', 'containedBy', 'or', 'and', 'not', 'filter',
    'order', 'limit', 'range', 'textSearch', 'match',
    'csv',
  ];

  // All chainable methods return the builder itself
  methods.forEach((method) => {
    builder[method] = vi.fn().mockReturnValue(builder);
  });

  // Terminal methods return data
  builder.single = vi.fn().mockResolvedValue({ data, error });
  builder.maybeSingle = vi.fn().mockResolvedValue({ data, error });
  builder.then = undefined as unknown as ReturnType<typeof vi.fn>; // Make it thenable

  // Make the builder itself return a promise when awaited
  const promise = Promise.resolve({ data, error });
  Object.setPrototypeOf(builder, {
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
  });

  return builder;
}

export function createMockSupabaseClient(overrides: Record<string, unknown> = {}) {
  const mockFrom = vi.fn().mockReturnValue(createMockQueryBuilder());

  const client = {
    from: mockFrom,
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      updateUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test.jpg' }, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/test.jpg' },
        }),
      }),
    },
    ...overrides,
  };

  return client;
}
