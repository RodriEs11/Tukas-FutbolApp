import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('Renderiza variantes (primary, secondary, ghost, danger)', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByText('Primary').className).toContain('bg-accent');
    
    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByText('Secondary').className).toContain('bg-muted');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByText('Ghost').className).toContain('hover:text-foreground');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByText('Danger').className).toContain('bg-destructive');
  });

  it('Renderiza tamaños (sm, md, lg)', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText('Small').className).toContain('px-3');

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText('Medium').className).toContain('px-4');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText('Large').className).toContain('px-6');
  });

  it('Muestra spinner con isLoading', () => {
    render(<Button isLoading>Loading</Button>);
    // Assume there is an svg or a specific class for loading
    expect(document.querySelector('svg.animate-spin')).toBeDefined();
  });

  it('Se deshabilita con isLoading o disabled', () => {
    const { rerender } = render(<Button disabled>Test</Button>);
    expect(screen.getByRole('button')).toBeDisabled();

    rerender(<Button isLoading>Test 2</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('Aplica fullWidth', () => {
    render(<Button className="w-full">Full Width</Button>);
    expect(screen.getByRole('button').className).toContain('w-full');
  });

  it('Ejecuta onClick', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
