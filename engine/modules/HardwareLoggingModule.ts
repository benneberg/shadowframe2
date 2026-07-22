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
    private readonly MAX_LOG_LINES = 500; // Circular log threshold

    private initialized = false;
    private writeBuffer: string[] = [];
    private flushTimer: any = null;
    private isFlushing = false;

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

        // Start periodic background flush every 3s
        this.flushTimer = setInterval(() => {
            this.flushBuffer();
        }, 3000);

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
     * Queues log entries into a memory buffer and schedules asynchronous flushes.
     */
    async appendFile(data: string): Promise<boolean> {
        this.writeBuffer.push(data);

        // If buffer gets large (>15 items), flush immediately
        if (this.writeBuffer.length >= 15) {
            this.flushBuffer();
        }
        return true;
    }

    /**
     * Flushes memory buffer to WebOSStorage with circular rotation
     */
    private async flushBuffer() {
        if (this.writeBuffer.length === 0 || this.isFlushing) return;
        this.isFlushing = true;

        const chunkToFlush = [...this.writeBuffer];
        this.writeBuffer = [];

        const webos = WebOSStorage.getInstance();

        try {
            const existing = await webos.readFile({
                storageType: this.STORAGE_TYPE,
                driveId: this.DRIVE_ID,
                path: this.LOG_PATH
            });

            const existingLines = existing ? existing.split('\n') : [];
            const mergedLines = [...existingLines, ...chunkToFlush];

            // Enforce circular logging cap
            const trimmedLines = mergedLines.length > this.MAX_LOG_LINES 
                ? mergedLines.slice(mergedLines.length - this.MAX_LOG_LINES)
                : mergedLines;

            await webos.writeFile({
                storageType: this.STORAGE_TYPE,
                driveId: this.DRIVE_ID,
                path: this.LOG_PATH
            }, trimmedLines.join('\n'));
        } catch (err) {
            console.error('[HardwareLoggingModule] Flush failed, restoring chunk:', err);
            this.writeBuffer = [...chunkToFlush, ...this.writeBuffer];
        } finally {
            this.isFlushing = false;
        }
    }

    /**
     * Retrieval Interface for signage maintenance dashboards
     */
    async getLogs(): Promise<string | null> {
        // Flush pending buffer before returning
        await this.flushBuffer();

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
        this.writeBuffer = [];
        return await WebOSStorage.getInstance().writeFile({
            storageType: this.STORAGE_TYPE,
            driveId: this.DRIVE_ID,
            path: this.LOG_PATH
        }, '');
    }
}
