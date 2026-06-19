import { eventBus } from '../core/EventBus';
import { WebOSStorage } from './WebOSStorage';
import { RuntimeEvent } from '../types';

/**
 * B2B Hardware Logging Module
 * Redirects kernel event stream to physical storage tiers.
 * Implements a virtual append logic for persistent signage maintenance logs.
 */
export class HardwareLoggingModule {
    private static instance: HardwareLoggingModule;
    private readonly LOG_PATH = '/logs/signage_kernel.log';
    private readonly STORAGE_TYPE = 'internal';
    private readonly DRIVE_ID = 'INTERNAL_STORAGE';

    private initialized = false;

    private constructor() {}

    static getInstance(): HardwareLoggingModule {
        if (!HardwareLoggingModule.instance) {
            HardwareLoggingModule.instance = new HardwareLoggingModule();
        }
        return HardwareLoggingModule.instance;
    }

    /**
     * Start the hardware logging protocol
     */
    init() {
        if (this.initialized) return;
        this.initialized = true;

        console.log('[HardwareLoggingModule] Initializing physical logging stream...');
        
        // Listen to everything from the engine heart
        eventBus.subscribe((event) => {
            this.handleKernelEvent(event);
        });

        // Log the kernel initialization event immediately
        this.appendFile('SYSTEM_BOOT: Hardware Logging Module attached to core kernel.');
    }

    private handleKernelEvent(event: any) {
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] KERNEL_EVENT: ${JSON.stringify(event)}`;
        this.appendFile(entry);
    }

    /**
     * Virtual Append Functionality
     * Implements a Read -> Merge -> Write cycle to simulate persistent file appending 
     * in the sandboxed internal application storage.
     */
    async appendFile(data: string): Promise<boolean> {
        const webos = WebOSStorage.getInstance();
        
        try {
            // Virtual append: fetch previous state, merge, and commit
            const existing = await webos.readFile({
                storageType: this.STORAGE_TYPE,
                driveId: this.DRIVE_ID,
                path: this.LOG_PATH
            });

            const merged = existing ? `${existing}\n${data}` : data;

            return await webos.writeFile({
                storageType: this.STORAGE_TYPE,
                driveId: this.DRIVE_ID,
                path: this.LOG_PATH
            }, merged);
        } catch (err) {
            console.error('[HardwareLoggingModule] Virtual append failed:', err);
            return false;
        }
    }

    /**
     * Retrieval Interface for signage maintenance dashboards
     */
    async getLogs(): Promise<string | null> {
        return await WebOSStorage.getInstance().readFile({
            storageType: this.STORAGE_TYPE,
            driveId: this.DRIVE_ID,
            path: this.LOG_PATH
        });
    }

    /**
     * Reset the maintenance log
     */
    async purge(): Promise<boolean> {
        return await WebOSStorage.getInstance().writeFile({
            storageType: this.STORAGE_TYPE,
            driveId: this.DRIVE_ID,
            path: this.LOG_PATH
        }, '');
    }
}
