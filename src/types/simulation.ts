// Core data models for the Bluetooth simulation
export interface Device {
  id: string;
  name: string;
  type: 'phone' | 'headset' | 'laptop' | 'tablet' | 'watch';
  osFingerprint: string;
  syntheticMac: string;
  signalStrength: number; // 0-100
  pairedWith: string[];
  vulnerabilityScore: number; // 0-100, higher = more vulnerable
  location: { x: number; y: number };
  isDiscoverable: boolean;
  hasPairingProtection: boolean;
  lastSeen: Date;
  status: 'discovered' | 'paired' | 'vulnerable' | 'spoofed' | 'protected';
}

export interface SimulationEvent {
  id: string;
  timestamp: Date;
  type: 'discovery' | 'pairing_attempt' | 'message_sent' | 'data_access' | 'mac_spoof' | 'defense_activated';
  sourceDevice: string;
  targetDevice?: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  success: boolean;
  details?: Record<string, any>;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  learningObjectives: string[];
  prerequisites: string[];
  deviceCount: number;
  defenseLevel: number; // 0-100
  signalRange: number; // meters
  devices: Device[];
  events: SimulationEvent[];
  seed?: number;
}

export interface CommandTemplate {
  id: string;
  template: string;
  description: string;
  category: 'scan' | 'message' | 'access' | 'spoof' | 'defend';
  simulationAction: (params: Record<string, any>) => SimulationEvent[];
}

export interface SimulationState {
  currentScenario: Scenario | null;
  devices: Map<string, Device>;
  events: SimulationEvent[];
  isRunning: boolean;
  currentTime: Date;
  seed: number;
  logs: string[];
}
