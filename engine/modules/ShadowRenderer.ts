
import { Template, PlaylistItem as MediaAsset } from '../types';

export class ShadowRenderer {
  private container: HTMLElement;
  private shadowRoot: ShadowRoot;
  private contentLayer: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    // Layer 1
    this.contentLayer = document.createElement('div');
    this.contentLayer.style.position = 'absolute';
    this.contentLayer.style.top = '0';
    this.contentLayer.style.left = '0';
    this.contentLayer.style.width = '100%';
    this.contentLayer.style.height = '100%';
    this.contentLayer.style.zIndex = '1';
    this.contentLayer.style.pointerEvents = 'none'; // Template content often shouldn't block video clicks unless interactive
    
    this.container.appendChild(this.contentLayer);
    this.shadowRoot = this.contentLayer.attachShadow({ mode: 'open' });
  }

  renderTemplate(template: Template | null, media: MediaAsset, playlistName: string, playerId: string) {
    if (!template) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    let html = template.html;
    html = html.replace(/\{\{media\.name\}\}/g, media.mediaId);
    html = html.replace(/\{\{playlist\.name\}\}/g, playlistName);
    html = html.replace(/\{\{playerId\}\}/g, playerId);

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        ${template.css}
      </style>
      <div id="root">
        ${html}
      </div>
    `;

    // Execute JS snippet safely
    try {
      const script = document.createElement('script');
      script.textContent = `
        (function() {
          try {
            ${template.js}
          } catch(e) {
            console.error('[ShadowRenderer] Template JS Error:', e);
          }
        })();
      `;
      this.shadowRoot.appendChild(script);
    } catch (err) {
      console.error('[ShadowRenderer] Failed to execute JS:', err);
    }
  }

  clear() {
    this.shadowRoot.innerHTML = '';
  }
}
