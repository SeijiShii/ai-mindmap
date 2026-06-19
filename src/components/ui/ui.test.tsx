import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import { Chip } from './Chip';
import { AppHeader } from './AppHeader';
import { InfoButton } from './InfoButton';
import { StageSpinner } from './StageSpinner';

describe('Button', () => {
  it('N1: renders primary variant as a button with token class', () => {
    render(<Button>送信</Button>);
    const btn = screen.getByRole('button', { name: '送信' });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('bg-primary');
  });
  it('E1: disabled is not clickable', () => {
    let clicked = false;
    render(
      <Button disabled onClick={() => (clicked = true)}>
        x
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(clicked).toBe(false);
  });
});

describe('Chip', () => {
  it('N2: kind=relation shows accent-coded chip', () => {
    render(<Chip kind="relation" />);
    const chip = screen.getByText('関連');
    expect(chip).toHaveAttribute('data-kind', 'relation');
    expect(chip.className).toContain('text-accent');
  });
});

describe('AppHeader (CF-20260609-007 single-row)', () => {
  it('B1: long title gets nowrap + ellipsis, actions never wrap', () => {
    render(<AppHeader title="とても長いアプリのタイトルです" actions={<span>menu</span>} />);
    const title = screen.getByText('とても長いアプリのタイトルです');
    expect(title.className).toContain('whitespace-nowrap');
    expect(title.className).toContain('text-ellipsis');
    const nav = screen.getByText('menu').closest('nav');
    expect(nav?.className).toContain('flex-shrink-0');
    expect(nav?.className).toContain('whitespace-nowrap');
  });
});

describe('InfoButton (O41)', () => {
  it('N4: opens a modal explaining the service', () => {
    render(<InfoButton>会議を聞きながら AI と考えをほどくマインドマップ</InfoButton>);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByLabelText('これは何？'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/考えをほどく/)).toBeInTheDocument();
  });
});

describe('StageSpinner (O45)', () => {
  it('N5: renders the stage label as a live status', () => {
    render(<StageSpinner stageLabel="要点を聞き取っています…" />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('要点を聞き取っています…');
  });
});
