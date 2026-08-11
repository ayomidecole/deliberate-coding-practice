import { readNumber, readObject, readString } from './primitives';

export class ServiceAlert {
    readonly id: string;
    readonly title: string;
    readonly serviceName: string;
    readonly severity: number;

    constructor(value: unknown) {
        const serviceAlert = readObject(value, 'ServiceAlert');
        this.id = readString(serviceAlert.alert_id, 'alert_id');
        this.title = readString(serviceAlert.title, 'title');
        this.serviceName = readString(
            serviceAlert.service_name,
            'service_name',
        );
        this.severity = readNumber(serviceAlert.severity, 'severity');
    }
}
