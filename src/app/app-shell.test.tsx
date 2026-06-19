import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppShell } from './App';

describe('AppShell composition (O57 smoke)', () => {
  it('APP-S1: renders the header, intro and info button', () => {
    render(<AppShell />);
    expect(screen.getByText('AIと一緒に描くマインドマップ')).toBeInTheDocument();
    expect(screen.getByText(/AI と往復で/)).toBeInTheDocument();
    expect(screen.getByLabelText('これは何？')).toBeInTheDocument();
  });

  it('APP-S4 / O55: footer exposes the legal links (reachable, not orphaned)', () => {
    render(<AppShell />);
    expect(screen.getByText('プライバシー')).toBeInTheDocument();
    expect(screen.getByText('利用規約')).toBeInTheDocument();
    expect(screen.getByText('特商法表記')).toBeInTheDocument();
  });

  it('routes to a legal page', () => {
    render(<AppShell initialPath="/legal/privacy" />);
    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument();
  });

  it('shows a 404 for unknown routes', () => {
    render(<AppShell initialPath="/nope" />);
    expect(screen.getByText('ページが見つかりません')).toBeInTheDocument();
  });

  it('O41: info modal opens explaining the service', () => {
    render(<AppShell />);
    fireEvent.click(screen.getByLabelText('これは何？'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
