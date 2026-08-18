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
    let title = 'Choose a channel';
    let description = 'Select where the release context should be delivered.';

    if (isSent) {
        title = 'Delivery confirmed';
        description = 'The handoff channel is locked.';
    } else if (value !== null) {
        title = 'Channel selected';
        description = `${value} will receive the release context.`;
    }

    return (
        <div className="handoff-channel-panel">
            <Alert>
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
            </Alert>
            <Separator />
            <label id="handoff-channel-label">Handoff channel</label>
            <Select
                value={value}
                disabled={disabled}
                onValueChange={(nextValue) => onValueChange(nextValue)}
            >
                <SelectTrigger aria-labelledby="handoff-channel-label">
                    <SelectValue placeholder="Choose a channel" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Slack channel">Slack channel</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Incident room">Incident room</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
