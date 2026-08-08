import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('Renderiza variantes', () => {
    const { rerender } = render(<Badge variant="default">Default</Badge>);
    expect(screen.getByText('Default').className).toContain('bg-muted');

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success').className).toContain('bg-success/10');

    rerender(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText('Danger').className).toContain('bg-destructive/10');
  });

  it('Renderiza children', () => {
    render(<Badge>Nuevo</Badge>);
    expect(screen.getByText('Nuevo')).toBeDefined();
  });
});
