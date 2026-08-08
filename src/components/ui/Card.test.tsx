import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle } from './Card';

describe('Card', () => {
  it('Renderiza children', () => {
    render(
      <Card>
        <div>Contenido del card</div>
      </Card>
    );
    expect(screen.getByText('Contenido del card')).toBeDefined();
  });

  it('Aplica variante interactive', () => {
    const { container } = render(<Card className="hover:bg-accent cursor-pointer">Clickable</Card>);
    expect(container.firstChild?.className).toContain('cursor-pointer');
  });

  it('Aplica padding', () => {
    const { container } = render(<Card className="p-6">Padding</Card>);
    expect(container.firstChild?.className).toContain('p-6');
  });

  it('CardHeader y CardTitle renderizan', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Título del Card</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('Título del Card')).toBeDefined();
  });
});
