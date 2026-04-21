import { eventBus } from '../core/EventBus';
import { WebOSStorage } from './WebOSStorage';
import { RuntimeEvent } from '../types';

/**
 * B2B Hardware Logging Module
 * Redirects kernel event stream to physical storage tiers.
 * Implements the "Virtual Append" strategy for webOS persistence.
 */
export class HardwareLogger {
    private static instance: HardwareLogger;
    private readonly LOG_PATH = '/logs/kernel.log';
    private readonly STORAGE_TYPE = 'internal';
    private readonly DRIVE_ID = 'INTERNAL_STORAGE';

    private constructor() {}

    static getInstance(): HardwareLogger {
        if (!HardwareLogger.instance) {
            HardwareLogger.instance = new HardwareLogger();
        }
        return HardwareLogger.instance;
    }

    /**
     * Start the hardware logging protocol
     */
    init() {
        console.log('[HardwareLogger] Initializing physical logging stream...');
        
        // Listen to everything from the engine heart
        eventBus.subscribe((event) => {
            this.logEvent(event);
        });

        // Log the kernel initialization event immediately
        this.logMessage('KERNEL_INIT: Hardware Logger attached to storage stack.');
    }

    private logEvent(event: any) {
        // Find the type and payload from the event bus data
        // The eventBus.subscribe passes the payload from the specific event
        // So we need to format it nicely
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] EVENT: ${JSON.stringify(event)}`;
        this.persist(entry);
    }

    private logMessage(msg: string) {
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] INFO: ${msg}`;
        this.persist(entry);
    }

    private async persist(entry: string) {
        const webos = WebOSStorage.getInstance();
        
        // Use the virtual append workaround (Read -> Modify -> Overwrite)
        // to ensure we don't lose previous boot logs or session data.
        await webos.appendFile({
            storageType: this.STORAGE_TYPE,
            driveId: this.DRIVE_ID,
            path: this.LOG_PATH
        }, entry);
    }

    /**
     * Diagnostic: Retrieve the full log from physical storage
     */
    async getLogs(): Promise<string | null> {
        return await WebOSStorage.getInstance().readFile({
            storageType: this.STORAGE_TYPE,
            driveId: this.DRIVE_ID,
            path: this.LOG_PATH
        });
    }

    /**
     * Maintenance: Purge the physical log file
     */
    async clearLogs(): Promise<boolean> {
        return await WebOSStorage.getInstance().writeFile({
            storageType: this.STORAGE_TYPE,
            driveId: this.DRIVE_ID,
            path: this.LOG_PATH
        }, '');
    }
}
