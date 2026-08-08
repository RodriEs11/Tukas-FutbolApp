import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('Alterna tema al click y usa localStorage', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(localStorage.getItem('theme')).toBeNull(); // Inicialmente no hay nada
    
    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('light'); // dark -> light
    expect(document.documentElement.classList.contains('light')).toBe(true);

    fireEvent.click(button);
    expect(localStorage.getItem('theme')).toBe('dark'); // light -> dark
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });

  it('Carga el tema desde localStorage al montar', () => {
    localStorage.setItem('theme', 'light');
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });
});
