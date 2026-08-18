import { Button } from '../ui/button';
import type { DiffViewMode } from './diff-view-mode';

export type DiffModeControlProps = {
  readonly value: DiffViewMode;
  readonly onValueChange: (nextMode: DiffViewMode) => void;
};

export function DiffModeControl({
  value,
  onValueChange,
}: DiffModeControlProps) {
  return (
    <div className="diff-mode-control" role="group" aria-label="Diff layout">
      <Button
        type="button"
        variant={value === 'split' ? 'default' : 'outline'}
        aria-pressed={value === 'split'}
        onClick={() => onValueChange('split')}
      >
        Split view
      </Button>
      <Button
        type="button"
        variant={value === 'unified' ? 'default' : 'outline'}
        aria-pressed={value === 'unified'}
        onClick={() => onValueChange('unified')}
      >
        Unified view
      </Button>
    </div>
  );
}
