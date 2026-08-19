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
  const diffFile = generateDiffFile(
    change.fileName,
    change.beforeContent,
    change.fileName,
    change.afterContent,
    change.language,
    change.language
  )

  diffFile.initTheme('light')
  diffFile.init()

  if (viewMode === 'split') {
    diffFile.buildSplitDiffLines()
  } else {
    diffFile.buildUnifiedDiffLines()
  }

  return diffFile
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
