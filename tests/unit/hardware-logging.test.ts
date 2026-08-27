import { describe, it, expect, beforeEach } from 'vitest';
import { HardwareLoggingModule } from '../../engine/modules/HardwareLoggingModule';

describe('HardwareLoggingModule', () => {
  beforeEach(async () => {
    localStorage.clear();
    const logger = HardwareLoggingModule.getInstance();
    await logger.purge();
  });

  it('queues and retrieves logs', async () => {
    const logger = HardwareLoggingModule.getInstance();
    await logger.appendFile('TEST_LINE_1');
    await logger.appendFile('TEST_LINE_2');

    const logs = await logger.getLogs();
    expect(logs).toContain('TEST_LINE_1');
    expect(logs).toContain('TEST_LINE_2');
  });

  it('purges logs cleanly', async () => {
    const logger = HardwareLoggingModule.getInstance();
    await logger.appendFile('TEMPORARY_LOG');
    await logger.purge();

    const logs = await logger.getLogs();
    expect(logs).toBe('');
  });

  it('enforces circular buffer limit capped at 500 lines', async () => {
    const logger = HardwareLoggingModule.getInstance();
    // Append 550 lines
    for (let i = 1; i <= 550; i++) {
      await logger.appendFile(`LOG_ENTRY_${i}`);
    }

    const logs = await logger.getLogs();
    const lines = (logs || '').split('\n').filter(Boolean);
    expect(lines.length).toBeLessThanOrEqual(500);
    // Earliest entries should have been rotated out
    expect(logs).not.toContain('LOG_ENTRY_1\n');
    expect(logs).toContain('LOG_ENTRY_550');
  });
});
