import { describe, it, expect, beforeEach } from 'vitest';
import { ShadowRenderer } from '../../engine/modules/ShadowRenderer';
import { DualVideoEngine } from '../../engine/video/DualVideoEngine';
import { Template, PlaylistItem } from '../../engine/types';

describe('Player Viewport & Template Overlay Compositor', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '1920px';
    container.style.height = '1080px';
    container.style.position = 'relative';
    document.body.appendChild(container);
  });

  it('mounts dual video engine surfaces (Slot A and Slot B)', () => {
    const videoEngine = new DualVideoEngine(container);
    expect(videoEngine).toBeDefined();

    const videoElements = container.querySelectorAll('video');
    expect(videoElements.length).toBe(2);

    const slotA = videoElements[0];
    const slotB = videoElements[1];
    expect(slotA.style.position).toBe('absolute');
    expect(slotB.style.position).toBe('absolute');
    expect(slotA.style.width).toBe('100%');
    expect(slotB.style.width).toBe('100%');
  });

  it('creates an isolated ShadowRoot layer for template overlay composition', () => {
    const renderer = new ShadowRenderer(container);
    expect(renderer).toBeDefined();

    // Check content layer attached to container
    const layers = container.querySelectorAll('div');
    const overlayLayer = Array.from(layers).find(el => el.shadowRoot !== null);
    expect(overlayLayer).toBeDefined();
    expect(overlayLayer?.shadowRoot).toBeDefined();
  });

  it('interpolates template variables and injects overlay styling in Shadow DOM', () => {
    const renderer = new ShadowRenderer(container);
    const mockTemplate: Template = {
      templateId: 'tpl-test',
      name: 'TEST_OVERLAY',
      html: '<div class="banner"><h1>{{media.name}}</h1><p>{{playerId}}</p><p>{{playlist.name}}</p></div>',
      css: '.banner { background: rgba(0,0,0,0.8); color: #00ffc6; }',
      js: 'window.__tpl_loaded = true;',
      createdAt: new Date().toISOString(),
    };

    const mockMedia: PlaylistItem = {
      mediaId: 'media-node-alpha',
      duration: 10,
      type: 'video',
      url: 'https://example.com/stream.mp4',
    };

    renderer.renderTemplate(mockTemplate, mockMedia, 'MAIN_SCHEDULE', 'NODE-01');

    const overlayLayer = Array.from(container.querySelectorAll('div')).find(el => el.shadowRoot !== null);
    const shadowRoot = overlayLayer?.shadowRoot;
    expect(shadowRoot).toBeDefined();

    const rootContent = shadowRoot?.innerHTML || '';
    expect(rootContent).toContain('media-node-alpha');
    expect(rootContent).toContain('NODE-01');
    expect(rootContent).toContain('MAIN_SCHEDULE');
    expect(rootContent).toContain('.banner { background: rgba(0,0,0,0.8); color: #00ffc6; }');
  });

  it('clears Shadow DOM overlay when null template is provided', () => {
    const renderer = new ShadowRenderer(container);
    const mockMedia: PlaylistItem = {
      mediaId: 'media-item',
      duration: 15,
      type: 'image',
      url: 'https://example.com/image.jpg',
    };

    renderer.renderTemplate(null, mockMedia, 'PLAYLIST_A', 'NODE-02');
    const overlayLayer = Array.from(container.querySelectorAll('div')).find(el => el.shadowRoot !== null);
    expect(overlayLayer?.shadowRoot?.innerHTML).toBe('');
  });
});
