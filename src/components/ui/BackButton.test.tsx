import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackButton } from './BackButton';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn().mockReturnValue({ push: vi.fn(), back: vi.fn() }),
}));

describe('BackButton', () => {
  it('Renderiza "Volver"', () => {
    render(<BackButton fallbackHref="/home" />);
    expect(screen.getByText('Volver')).toBeDefined();
  });

  it('Navega con router.back()', () => {
    const mockBack = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ back: mockBack, push: vi.fn() } as any);
    
    const originalLength = window.history.length;
    Object.defineProperty(window, 'history', {
      value: { length: 2 },
      writable: true,
    });

    render(<BackButton fallbackHref="/home" />);
    fireEvent.click(screen.getByText('Volver'));
    expect(mockBack).toHaveBeenCalled();

    Object.defineProperty(window, 'history', { value: { length: originalLength } });
  });

  it('Navega a fallbackHref si se provee y se hace click (sin historial)', () => {
    const mockPush = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush, back: vi.fn() } as any);
    
    const originalLength = window.history.length;
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true,
    });

    render(<BackButton fallbackHref="/home" />);
    fireEvent.click(screen.getByText('Volver'));
    expect(mockPush).toHaveBeenCalledWith('/home');

    Object.defineProperty(window, 'history', { value: { length: originalLength } });
  });
});
