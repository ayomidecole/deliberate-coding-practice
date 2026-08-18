import { useMemo } from 'react';
import {
  generateDiffFile,
  type DiffFile,
} from '@git-diff-view/file';
import { DiffModeEnum, DiffView } from '@git-diff-view/react';
import '@git-diff-view/react/styles/diff-view-pure.css';

import type { ConfigurationChange } from '../../domain/configuration-change';
import type { DiffViewMode } from './diff-view-mode';

export type ConfigurationDiffViewerProps = {
  readonly change: ConfigurationChange;
  readonly viewMode: DiffViewMode;
};

function createPreparedDiff(
  change: ConfigurationChange,
  viewMode: DiffViewMode,
): DiffFile {
  void change;
  void viewMode;
  void generateDiffFile;

  throw new Error('Prepare the configuration diff');
}

export function ConfigurationDiffViewer({
  change,
  viewMode,
}: ConfigurationDiffViewerProps) {
  const diffFile = useMemo(
    () => createPreparedDiff(change, viewMode),
    [change, viewMode],
  );

  const libraryMode =
    viewMode === 'split' ? DiffModeEnum.Split : DiffModeEnum.Unified;

  return (
    <section
      className="configuration-diff"
      aria-label={`${change.fileName} ${viewMode} diff`}
    >
      <DiffView
        diffFile={diffFile}
        diffViewMode={libraryMode}
        diffViewTheme="light"
        diffViewWrap
      />
    </section>
  );
}
