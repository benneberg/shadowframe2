
import mqtt, { MqttClient } from 'mqtt';

interface ShadowState {
  desired?: Record<string, any>;
  reported?: Record<string, any>;
}

interface ShadowMessage {
  state: ShadowState;
  version: number;
  timestamp: number;
}

export class DeviceShadowClient {
  private client!: MqttClient;
  private playerId: string;
  private currentVersion = 0;
  private reportedState: Record<string, any> = {};
  private isHydrated = false; // Hydration barrier

  constructor(playerId: string) {
    this.playerId = playerId;
  }

  connect(brokerUrl: string = 'wss://test.mosquitto.org:8081') {
    this.client = mqtt.connect(brokerUrl);
    this.client.on('connect', () => {
      console.log('[MQTT] Platform-v3 Link Established');
      this.subscribe();
      this.requestShadow();
    });
    this.client.on('message', (topic, payload) => {
      this.handleMessage(topic, payload.toString());
    });
  }

  private topic(type: string) {
    return `device/${this.playerId}/shadow/${type}`;
  }

  private subscribe() {
    this.client.subscribe(this.topic('delta'));
    this.client.subscribe(this.topic('get/accepted'));
  }

  private requestShadow() {
    this.client.publish(this.topic('get'), '');
  }

  private handleMessage(topic: string, payload: string) {
    try {
      const msg: ShadowMessage = JSON.parse(payload);
      
      // Hydration Barrier
      if (topic.includes('delta') && !this.isHydrated) {
        console.warn('[Shadow] Delta ignored: awaiting initial hydration.');
        return;
      }

      if (msg.version <= this.currentVersion) return;
      this.currentVersion = msg.version;
      
      if (topic.includes('delta')) {
        this.reconcile(msg.state.desired || {});
      }
      if (topic.includes('get/accepted')) {
        this.isHydrated = true;
        this.reconcile(msg.state.desired || {});
      }
    } catch (err) {
      console.error('[ShadowClient] MQTT-Shadow parsing error:', err);
    }
  }

  private reconcile(desired: Record<string, any>) {
    const changes: Record<string, any> = {};
    for (const key in desired) {
      if (this.reportedState[key] !== desired[key]) {
        changes[key] = desired[key];
      }
    }
    if (Object.keys(changes).length > 0) {
      console.log('[Shadow] Delta matched. Syncing state...', changes);
      window.dispatchEvent(new CustomEvent('shadow:update', { detail: changes }));
      this.updateReported(changes);
    }
  }

  updateReported(partial: Record<string, any>) {
    this.reportedState = { ...this.reportedState, ...partial };
    const payload = JSON.stringify({ state: { reported: this.reportedState } });
    this.client.publish(this.topic('update'), payload);
  }

  disconnect() {
    this.client?.end();
  }
}
