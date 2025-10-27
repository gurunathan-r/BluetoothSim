import { Device, SimulationEvent, Scenario, SimulationState, CommandTemplate } from '../types/simulation';

// Deterministic random number generator using seed
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  nextFloat(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

// Device generation utilities
export class DeviceGenerator {
  private random: SeededRandom;

  constructor(seed: number) {
    this.random = new SeededRandom(seed);
  }

  generateMac(): string {
    const hex = '0123456789ABCDEF';
    let mac = '';
    for (let i = 0; i < 6; i++) {
      if (i > 0) mac += ':';
      mac += hex[this.random.nextInt(16)] + hex[this.random.nextInt(16)];
    }
    return mac;
  }

  generateDeviceName(type: Device['type']): string {
    const names = {
      phone: ['iPhone 14', 'Samsung Galaxy S23', 'Google Pixel 7', 'OnePlus 11'],
      headset: ['AirPods Pro', 'Sony WH-1000XM5', 'Bose QC45', 'Jabra Elite 85t'],
      laptop: ['MacBook Pro', 'Dell XPS 13', 'ThinkPad X1', 'Surface Laptop'],
      tablet: ['iPad Pro', 'Samsung Tab S8', 'Surface Pro', 'Lenovo Tab'],
      watch: ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin Fenix', 'Fitbit Versa']
    };
    
    const typeNames = names[type];
    return typeNames[this.random.nextInt(typeNames.length)];
  }

  generateOSFingerprint(type: Device['type']): string {
    const fingerprints = {
      phone: ['iOS 16.6', 'Android 13', 'Android 12', 'iOS 15.7'],
      headset: ['Bluetooth 5.0', 'Bluetooth 5.2', 'Bluetooth 5.1', 'Bluetooth 4.2'],
      laptop: ['Windows 11', 'macOS Ventura', 'Ubuntu 22.04', 'Windows 10'],
      tablet: ['iPadOS 16', 'Android 13', 'Windows 11', 'Android 12'],
      watch: ['watchOS 9', 'Wear OS 3', 'Garmin OS', 'Fitbit OS']
    };
    
    const typeFingerprints = fingerprints[type];
    return typeFingerprints[this.random.nextInt(typeFingerprints.length)];
  }

  generateDevice(type: Device['type'], location: { x: number; y: number }): Device {
    return {
      id: `device_${Date.now()}_${this.random.nextInt(1000)}`,
      name: this.generateDeviceName(type),
      type,
      osFingerprint: this.generateOSFingerprint(type),
      syntheticMac: this.generateMac(),
      signalStrength: this.random.nextInt(100),
      pairedWith: [],
      vulnerabilityScore: this.random.nextInt(100),
      location,
      isDiscoverable: this.random.next() > 0.3, // 70% discoverable
      hasPairingProtection: this.random.next() > 0.4, // 60% have protection
      lastSeen: new Date(),
      status: 'discovered'
    };
  }
}

// Simulation engine core
export class SimulationEngine {
  private state: SimulationState;
  private random: SeededRandom;
  private deviceGenerator: DeviceGenerator;

  constructor(seed: number = Date.now()) {
    this.random = new SeededRandom(seed);
    this.deviceGenerator = new DeviceGenerator(seed);
    
    this.state = {
      currentScenario: null,
      devices: new Map(),
      events: [],
      isRunning: false,
      currentTime: new Date(),
      seed,
      logs: []
    };
  }

  // Command templates for simulation
  getCommandTemplates(): CommandTemplate[] {
    return [
      {
        id: 'scan',
        template: 'sim scan --range=<meters> --filter=<device-type>',
        description: 'Simulate Bluetooth device discovery scan',
        category: 'scan',
        simulationAction: (params) => this.simulateScan(params)
      },
      {
        id: 'message',
        template: 'sim message --from=<attacker> --to=<target> --payload="<text>"',
        description: 'Simulate BlueJacking (sending unsolicited messages)',
        category: 'message',
        simulationAction: (params) => this.simulateMessage(params)
      },
      {
        id: 'pull_info',
        template: 'sim pull-info --target=<device> --protocol=OBEX',
        description: 'Simulate Bluesnarfing (unauthorized data access)',
        category: 'access',
        simulationAction: (params) => this.simulateDataAccess(params)
      },
      {
        id: 'set_mac',
        template: 'sim set-mac --device=<device-name-or-id> --mac=<new-mac>',
        description: 'Simulate MAC address spoofing (use device name like "Dell" or full device ID)',
        category: 'spoof',
        simulationAction: (params) => this.simulateMacSpoof(params)
      },
      {
        id: 'defend',
        template: 'sim defend --device=<target> --action=<defense-type>',
        description: 'Simulate defensive security measures',
        category: 'defend',
        simulationAction: (params) => this.simulateDefense(params)
      }
    ];
  }

  // Simulation action implementations
  private simulateScan(params: Record<string, any>): SimulationEvent[] {
    const events: SimulationEvent[] = [];
    const range = parseInt(params.range) || 10;
    const filter = params.filter || 'all';

    this.state.devices.forEach(device => {
      if (device.isDiscoverable) {
        const event: SimulationEvent = {
          id: `scan_${Date.now()}_${this.random.nextInt(1000)}`,
          timestamp: new Date(),
          type: 'discovery',
          sourceDevice: 'attacker',
          targetDevice: device.id,
          description: `Discovered device: ${device.name} (${device.syntheticMac})`,
          severity: 'low',
          success: true,
          details: {
            signalStrength: device.signalStrength,
            deviceType: device.type,
            vulnerabilityScore: device.vulnerabilityScore
          }
        };
        events.push(event);
        this.state.events.push(event);
      }
    });

    this.log(`SIMULATED SCAN: Discovered ${events.length} devices in range`);
    return events;
  }

  private simulateMessage(params: Record<string, any>): SimulationEvent[] {
    const events: SimulationEvent[] = [];
    const target = params.target || 'all';
    const payload = params.payload || 'Test message';

    this.state.devices.forEach(device => {
      if (device.isDiscoverable && device.vulnerabilityScore > 30) {
        const event: SimulationEvent = {
          id: `message_${Date.now()}_${this.random.nextInt(1000)}`,
          timestamp: new Date(),
          type: 'message_sent',
          sourceDevice: 'attacker',
          targetDevice: device.id,
          description: `Sent unsolicited message to ${device.name}: "${payload}"`,
          severity: 'medium',
          success: this.random.next() > 0.2, // 80% success rate
          details: {
            payload,
            deviceVulnerability: device.vulnerabilityScore
          }
        };
        events.push(event);
        this.state.events.push(event);
      }
    });

    this.log(`SIMULATED BLUEJACKING: Sent messages to ${events.length} devices`);
    return events;
  }

  private simulateDataAccess(params: Record<string, any>): SimulationEvent[] {
    const events: SimulationEvent[] = [];
    const targetId = params.target;

    if (targetId && this.state.devices.has(targetId)) {
      const device = this.state.devices.get(targetId)!;
      
      if (device.vulnerabilityScore > 50 && !device.hasPairingProtection) {
        const event: SimulationEvent = {
          id: `access_${Date.now()}_${this.random.nextInt(1000)}`,
          timestamp: new Date(),
          type: 'data_access',
          sourceDevice: 'attacker',
          targetDevice: device.id,
          description: `Attempted unauthorized data access on ${device.name}`,
          severity: 'high',
          success: this.random.next() > 0.3, // 70% success rate
          details: {
            accessedData: ['contacts', 'calendar', 'photos'],
            deviceVulnerability: device.vulnerabilityScore,
            protocol: 'OBEX'
          }
        };
        events.push(event);
        this.state.events.push(event);
      }
    }

    this.log(`SIMULATED BLUESNARFING: Attempted data access on target device`);
    return events;
  }

  private simulateMacSpoof(params: Record<string, any>): SimulationEvent[] {
    const events: SimulationEvent[] = [];
    const deviceIdentifier = params.device || 'attacker';
    const newMac = params.mac;
    
    // Validate MAC address format if provided
    if (newMac && !/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(newMac)) {
      this.log(`SIMULATED MAC SPOOFING: Invalid MAC address format: ${newMac}`);
      return events;
    }
    
    const finalMac = newMac || this.deviceGenerator.generateMac();
    
    // Find the device by ID first, then by name if not found
    let device = this.state.devices.get(deviceIdentifier);
    
    if (!device) {
      // Try to find by name (case-insensitive partial match)
      const deviceArray = Array.from(this.state.devices.values());
      device = deviceArray.find(d => 
        d.name.toLowerCase().includes(deviceIdentifier.toLowerCase()) ||
        d.id.toLowerCase().includes(deviceIdentifier.toLowerCase())
      );
    }
    
    if (!device) {
      // List available devices for user reference
      const availableDevices = Array.from(this.state.devices.values())
        .map(d => `${d.name} (${d.id})`)
        .join(', ');
      this.log(`SIMULATED MAC SPOOFING: Device '${deviceIdentifier}' not found. Available devices: ${availableDevices}`);
      return events;
    }

    const oldMac = device.syntheticMac;

    const event: SimulationEvent = {
      id: `spoof_${Date.now()}_${this.random.nextInt(1000)}`,
      timestamp: new Date(),
      type: 'mac_spoof',
      sourceDevice: device.id,
      description: `Changed ${device.name} MAC address from ${oldMac} to ${finalMac}`,
      severity: 'high',
      success: true,
      details: {
        oldMac,
        newMac: finalMac,
        deviceName: device.name,
        deviceId: device.id
      }
    };

    // Actually update the device's MAC address
    device.syntheticMac = finalMac;
    device.lastSeen = new Date();
    
    // Update device status to indicate spoofing
    device.status = 'spoofed';

    events.push(event);
    this.state.events.push(event);
    this.log(`SIMULATED MAC SPOOFING: Successfully changed ${device.name} MAC from ${oldMac} to ${finalMac}`);
    return events;
  }

  private simulateDefense(params: Record<string, any>): SimulationEvent[] {
    const events: SimulationEvent[] = [];
    const targetId = params.target;
    const action = params.action || 'pairing-protection';

    if (targetId && this.state.devices.has(targetId)) {
      const device = this.state.devices.get(targetId)!;
      
      const event: SimulationEvent = {
        id: `defense_${Date.now()}_${this.random.nextInt(1000)}`,
        timestamp: new Date(),
        type: 'defense_activated',
        sourceDevice: targetId,
        description: `Activated ${action} on ${device.name}`,
        severity: 'low',
        success: true,
        details: {
          defenseType: action,
          deviceName: device.name
        }
      };

      events.push(event);
      this.state.events.push(event);
      
      // Update device protection status
      if (action === 'pairing-protection') {
        device.hasPairingProtection = true;
        device.vulnerabilityScore = Math.max(0, device.vulnerabilityScore - 20);
      }
    }

    this.log(`SIMULATED DEFENSE: Activated ${action} on target device`);
    return events;
  }

  // Utility methods
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    this.state.logs.push(`[${timestamp}] ${message}`);
  }

  getState(): SimulationState {
    return { 
      ...this.state,
      devices: new Map(this.state.devices),
      events: [...this.state.events],
      logs: [...this.state.logs]
    };
  }

  getDevices(): Device[] {
    return Array.from(this.state.devices.values());
  }

  getEvents(): SimulationEvent[] {
    return [...this.state.events];
  }

  getLogs(): string[] {
    return [...this.state.logs];
  }

  // Scenario management
  createScenario(name: string, deviceCount: number, defenseLevel: number): Scenario {
    const devices: Device[] = [];
    const deviceTypes: Device['type'][] = ['phone', 'headset', 'laptop', 'tablet', 'watch'];
    
    for (let i = 0; i < deviceCount; i++) {
      const type = deviceTypes[this.random.nextInt(deviceTypes.length)];
      const location = {
        x: this.random.nextFloat(50, 450),
        y: this.random.nextFloat(50, 350)
      };
      
      const device = this.deviceGenerator.generateDevice(type, location);
      
      // Adjust vulnerability based on defense level
      device.vulnerabilityScore = Math.max(0, device.vulnerabilityScore - defenseLevel);
      device.hasPairingProtection = defenseLevel > 50 || device.hasPairingProtection;
      
      devices.push(device);
      this.state.devices.set(device.id, device);
    }

    const scenario: Scenario = {
      id: `scenario_${Date.now()}`,
      name,
      description: `Custom scenario with ${deviceCount} devices`,
      learningObjectives: ['Understand Bluetooth security concepts', 'Learn about common vulnerabilities'],
      prerequisites: ['Basic understanding of wireless communication'],
      deviceCount,
      defenseLevel,
      signalRange: 10,
      devices,
      events: [],
      seed: this.state.seed
    };

    this.state.currentScenario = scenario;
    return scenario;
  }

  executeCommand(template: CommandTemplate, params: Record<string, any>): SimulationEvent[] {
    this.log(`EXECUTING: ${template.template} (SIMULATED - NO REAL EFFECT)`);
    return template.simulationAction(params);
  }
}
