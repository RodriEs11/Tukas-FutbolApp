import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';
import { mockRegularPlayer, mockPlayerNoAvatar } from '@/lib/test-utils/fixtures';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

describe('Avatar', () => {
  it('Muestra imagen con avatar_url', () => {
    const player = { ...mockRegularPlayer, avatar_url: '/test.jpg' };
    render(<Avatar player={player} />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('/test.jpg');
  });

  it('Muestra iniciales sin avatar_url', () => {
    const player = { ...mockPlayerNoAvatar, first_name: 'Test', last_name: 'User' };
    render(<Avatar player={player} />);
    expect(screen.getByText('TU')).toBeDefined();
  });

  it('Aplica tamaños sm/md/lg', () => {
    const player = mockPlayerNoAvatar;
    const { container: smContainer } = render(<Avatar player={player} size="sm" />);
    expect(smContainer.firstChild?.className).toContain('w-8 h-8');

    const { container: mdContainer } = render(<Avatar player={player} size="md" />);
    expect(mdContainer.firstChild?.className).toContain('w-10 h-10');

    const { container: lgContainer } = render(<Avatar player={player} size="lg" />);
    expect(lgContainer.firstChild?.className).toContain('w-14 h-14');
  });
});
