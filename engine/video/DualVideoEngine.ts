
type VideoSlot = 'A' | 'B';

export class DualVideoEngine {
  private videoA: HTMLVideoElement;
  private videoB: HTMLVideoElement;
  private active: VideoSlot = 'A';
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.videoA = this.createVideo();
    this.videoB = this.createVideo();
    this.container.append(this.videoA, this.videoB);
    this.setActive('A');
  }

  private createVideo(): HTMLVideoElement {
    const v = document.createElement('video');
    Object.assign(v, {
      autoplay: true,
      muted: true,
      playsInline: true,
      preload: 'auto'
    });
    Object.assign(v.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'opacity 150ms linear',
      opacity: '0',
      zIndex: '0'
    });
    return v;
  }

  private getActiveVideo(): HTMLVideoElement {
    return this.active === 'A' ? this.videoA : this.videoB;
  }

  private getInactiveVideo(): HTMLVideoElement {
    return this.active === 'A' ? this.videoB : this.videoA;
  }

  private setActive(slot: VideoSlot) {
    this.active = slot;
    const active = this.getActiveVideo();
    const inactive = this.getInactiveVideo();
    active.style.opacity = '1';
    active.style.zIndex = '1';
    inactive.style.opacity = '0';
    inactive.style.zIndex = '0';
  }

  async playNext(src: string): Promise<void> {
    const inactive = this.getInactiveVideo();
    const active = this.getActiveVideo();

    // Warm next decoder
    inactive.src = src;
    inactive.load();

    return new Promise((resolve) => {
      // readyState 3 = HAVE_FUTURE_DATA (enough to start)
      const checkReady = async () => {
        if (inactive.readyState >= 3) {
          
          // 🔥 Perfect Frame Sync (Optional/Experimental)
          if ('requestVideoFrameCallback' in (inactive as any)) {
            (inactive as any).requestVideoFrameCallback(async () => {
              await this.executeSwitch(inactive, active);
              resolve();
            });
          } else {
            await this.executeSwitch(inactive, active);
            resolve();
          }
        } else {
          setTimeout(checkReady, 10);
        }
      };
      checkReady();
    });
  }

  private async executeSwitch(next: HTMLVideoElement, prev: HTMLVideoElement) {
    await next.play();
    this.setActive(this.active === 'A' ? 'B' : 'A');
    
    // 🔥 Decoder stability: Release unused decoder
    setTimeout(() => {
      prev.pause();
      prev.removeAttribute('src');
      prev.load(); 
    }, 500);
  }

  stop() {
    [this.videoA, this.videoB].forEach(v => {
      v.pause();
      v.removeAttribute('src');
      v.load();
    });
  }
}
