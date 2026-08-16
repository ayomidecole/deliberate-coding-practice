import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export type HandoffChannelPanelProps = {
  readonly value: string | null;
  readonly disabled: boolean;
  readonly isSent: boolean;
  readonly onValueChange: (nextValue: string | null) => void;
};

export function HandoffChannelPanel({
  value,
  disabled,
  isSent,
  onValueChange,
}: HandoffChannelPanelProps) {
  return (
    <div className="handoff-channel-panel">
      <label id="handoff-channel-label">Handoff channel</label>
    </div>
  );
}
