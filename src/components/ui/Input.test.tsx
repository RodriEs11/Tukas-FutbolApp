import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('Renderiza con label', () => {
    render(<Input label="Nombre" name="nombre" />);
    expect(screen.getByText('Nombre')).toBeDefined();
    expect(screen.getByRole('textbox')).toBeDefined();
  });

  it('Muestra error', () => {
    render(<Input name="test" error="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeDefined();
  });

  it('Muestra helperText', () => {
    render(<Input name="test" helperText="Texto de ayuda" />);
    expect(screen.getByText('Texto de ayuda')).toBeDefined();
  });

  it('No muestra helperText con error', () => {
    render(<Input name="test" error="Error" helperText="Texto de ayuda" />);
    expect(screen.getByText('Error')).toBeDefined();
    expect(screen.queryByText('Texto de ayuda')).toBeNull();
  });

  it('Genera id desde label si no se provee', () => {
    render(<Input label="Apellido" name="apellido" />);
    const label = screen.getByText('Apellido');
    const input = screen.getByRole('textbox');
    expect(label.getAttribute('for')).toBe(input.getAttribute('id'));
  });
});
