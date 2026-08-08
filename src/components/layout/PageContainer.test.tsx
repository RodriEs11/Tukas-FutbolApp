import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PageContainer } from './PageContainer';

describe('PageContainer', () => {
  it('Renderiza children correctamente', () => {
    const { getByText } = render(
      <PageContainer>
        <div>Contenido de prueba</div>
      </PageContainer>
    );
    expect(getByText('Contenido de prueba')).toBeDefined();
  });

  it('Aplica className personalizado', () => {
    const { container } = render(
      <PageContainer className="mi-clase-extra">
        <div>Test</div>
      </PageContainer>
    );
    expect(container.firstChild).toHaveProperty('className');
    expect((container.firstChild as HTMLElement).className).toContain('mi-clase-extra');
  });

  it('Tiene padding bottom para mobile (pb-24)', () => {
    const { container } = render(
      <PageContainer>
        <div>Test</div>
      </PageContainer>
    );
    expect((container.firstChild as HTMLElement).className).toContain('pb-24');
  });
});
