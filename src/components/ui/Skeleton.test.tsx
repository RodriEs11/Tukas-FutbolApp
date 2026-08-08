import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('Renderiza variantes y tiene clases base', () => {
    const { container } = render(<Skeleton className="w-10 h-10" />);
    expect(container.firstElementChild?.className).toContain('animate-pulse');
    expect(container.firstElementChild?.className).toContain('bg-muted');
    expect(container.firstElementChild?.className).toContain('w-10 h-10');
  });

  it('Tiene aria-hidden', () => {
    const { container } = render(<Skeleton />);
    expect((container.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true');
  });
});
