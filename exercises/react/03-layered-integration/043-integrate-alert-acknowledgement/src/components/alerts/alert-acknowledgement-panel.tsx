import type { ServiceAlert } from '../../domain/service-alert';

export type AlertAcknowledgementPanelProps = {
    readonly alert: ServiceAlert;
    readonly acknowledged: boolean;
    readonly onAcknowledgementChange: (nextAcknowledged: boolean) => void;
};

export function AlertAcknowledgementPanel({
    alert,
    acknowledged,
    onAcknowledgementChange,
}: AlertAcknowledgementPanelProps) {
    return (
        <article aria-labelledby="alert-heading">
            <h3 id="alert-heading">{alert.title}</h3>
            <p>Service: {alert.serviceName}</p>
            <p>Severity: {alert.severity}</p>
            {acknowledged ? (
                <div>
                <p>Status: Acknowledged</p>
                <button
                    type="button"
                    onClick={() => onAcknowledgementChange(false)}
                >
                    Reopen alert
                </button>
            </div>
            ) : (
                <div>
                    <p>Status: Needs acknowledgement</p>
                    <button
                        type="button"
                        onClick={() => onAcknowledgementChange(true)}
                    >
                        Acknowledge alert
                    </button>
                </div>
            )}
        </article>
    );
}
