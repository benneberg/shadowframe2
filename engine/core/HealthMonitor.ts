export class HealthMonitor {
  private interval: any = null;
  private fps: number = 60;
  private lastTime: number = performance.now();
  private frames: number = 0;
  private running: boolean = false;

  start() {
    if (this.running) return;
    this.running = true;
    this.interval = setInterval(() => {
      this.calculateFPS();
    }, 1000);
    this.tick();
  }

  private tick() {
    if (!this.running) return;
    this.frames++;
    requestAnimationFrame(() => this.tick());
  }

  private calculateFPS() {
    const now = performance.now();
    this.fps = (this.frames * 1000) / (now - this.lastTime);
    this.frames = 0;
    this.lastTime = now;
  }

  getHealth(): string {
    if (this.fps < 30) return 'CRITICAL';
    if (this.fps < 50) return 'DEGRADED';
    return 'OK';
  }

  stop() {
    this.running = false;
    if (this.interval) clearInterval(this.interval);
  }
}
