import { Scenario, Device } from '../types/simulation';
import { DeviceGenerator } from '../engine/SimulationEngine';

export class ScenarioLibrary {
  private deviceGenerator: DeviceGenerator;

  constructor(seed: number = 12345) {
    this.deviceGenerator = new DeviceGenerator(seed);
  }

  getBlueJackingScenario(): Scenario {
    const devices: Device[] = [
      this.createAttackerDevice(),
      this.createVulnerablePhone('iPhone 14', { x: 200, y: 150 }),
      this.createVulnerablePhone('Samsung Galaxy S23', { x: 300, y: 200 }),
      this.createProtectedPhone('Google Pixel 7', { x: 150, y: 250 }),
      this.createHeadset('AirPods Pro', { x: 250, y: 100 })
    ];

    return {
      id: 'bluejacking_demo',
      name: 'BlueJacking Demonstration',
      description: 'Learn how unsolicited messages can be sent to nearby Bluetooth devices',
      learningObjectives: [
        'Understand how BlueJacking works conceptually',
        'Recognize the importance of Bluetooth discoverability settings',
        'Learn about privacy implications of open Bluetooth connections',
        'Identify defensive measures against unsolicited messages'
      ],
      prerequisites: [
        'Basic understanding of Bluetooth technology',
        'Knowledge of wireless communication principles'
      ],
      deviceCount: devices.length,
      defenseLevel: 30,
      signalRange: 10,
      devices,
      events: [],
      seed: 12345
    };
  }

  getBluesnarfingScenario(): Scenario {
    const devices: Device[] = [
      this.createAttackerDevice(),
      this.createHighlyVulnerablePhone('Old Android Phone', { x: 200, y: 150 }),
      this.createModeratelyVulnerablePhone('iPhone 12', { x: 300, y: 200 }),
      this.createProtectedPhone('Samsung Galaxy S23', { x: 150, y: 250 }),
      this.createLaptop('MacBook Pro', { x: 250, y: 100 })
    ];

    return {
      id: 'bluesnarfing_demo',
      name: 'Bluesnarfing Demonstration',
      description: 'Explore unauthorized data access through Bluetooth vulnerabilities',
      learningObjectives: [
        'Understand the concept of unauthorized data access via Bluetooth',
        'Learn about OBEX protocol vulnerabilities',
        'Recognize the importance of pairing protection',
        'Understand privacy risks of unsecured Bluetooth connections'
      ],
      prerequisites: [
        'Understanding of BlueJacking concepts',
        'Basic knowledge of data protocols'
      ],
      deviceCount: devices.length,
      defenseLevel: 40,
      signalRange: 10,
      devices,
      events: [],
      seed: 54321
    };
  }

  getMacSpoofingScenario(): Scenario {
    const devices: Device[] = [
      this.createAttackerDevice(),
      this.createPhone('iPhone 14', { x: 200, y: 150 }),
      this.createPhone('Samsung Galaxy S23', { x: 300, y: 200 }),
      this.createPhone('Google Pixel 7', { x: 150, y: 250 }),
      this.createPhone('OnePlus 11', { x: 250, y: 100 }),
      this.createLaptop('Dell XPS 13', { x: 350, y: 150 })
    ];

    return {
      id: 'mac_spoofing_demo',
      name: 'MAC Address Spoofing Demonstration',
      description: 'Learn about MAC address manipulation and device impersonation',
      learningObjectives: [
        'Understand MAC address structure and purpose',
        'Learn about legitimate vs malicious MAC randomization',
        'Recognize detection methods for duplicate MAC addresses',
        'Understand implications of device impersonation'
      ],
      prerequisites: [
        'Basic understanding of network addressing',
        'Knowledge of device identification concepts'
      ],
      deviceCount: devices.length,
      defenseLevel: 50,
      signalRange: 10,
      devices,
      events: [],
      seed: 98765
    };
  }

  getCrowdedCafeScenario(): Scenario {
    const devices: Device[] = [this.createAttackerDevice()];
    
    // Generate many devices for a crowded environment
    const deviceTypes: Device['type'][] = ['phone', 'headset', 'laptop', 'tablet', 'watch'];
    
    for (let i = 0; i < 15; i++) {
      const type = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
      const location = {
        x: 50 + Math.random() * 400,
        y: 50 + Math.random() * 300
      };
      
      const device = this.deviceGenerator.generateDevice(type, location);
      device.vulnerabilityScore = Math.random() * 80; // Mixed vulnerability levels
      device.isDiscoverable = Math.random() > 0.2; // 80% discoverable
      device.hasPairingProtection = Math.random() > 0.5; // 50% have protection
      
      devices.push(device);
    }

    return {
      id: 'crowded_cafe',
      name: 'Crowded Cafe Environment',
      description: 'High-density Bluetooth environment with mixed device types and security levels',
      learningObjectives: [
        'Understand Bluetooth behavior in crowded environments',
        'Learn about signal interference and range limitations',
        'Recognize different device types and their security profiles',
        'Practice scanning and device identification'
      ],
      prerequisites: [
        'Basic understanding of Bluetooth concepts',
        'Familiarity with device discovery'
      ],
      deviceCount: devices.length,
      defenseLevel: 25,
      signalRange: 15,
      devices,
      events: [],
      seed: 11111
    };
  }

  getOfficeEnvironmentScenario(): Scenario {
    const devices: Device[] = [
      this.createAttackerDevice(),
      this.createLaptop('Corporate Laptop', { x: 200, y: 150 }),
      this.createLaptop('Manager Laptop', { x: 300, y: 200 }),
      this.createPhone('Corporate iPhone', { x: 150, y: 250 }),
      this.createPhone('Employee Android', { x: 250, y: 100 }),
      this.createHeadset('Conference Headset', { x: 350, y: 150 }),
      this.createTablet('Meeting Room Tablet', { x: 100, y: 200 })
    ];

    // Set higher security for office environment
    devices.forEach(device => {
      if (device.id !== 'attacker') {
        device.vulnerabilityScore = Math.max(0, device.vulnerabilityScore - 30);
        device.hasPairingProtection = true;
        device.isDiscoverable = Math.random() > 0.6; // 40% discoverable
      }
    });

    return {
      id: 'office_environment',
      name: 'Office Environment',
      description: 'Corporate environment with enhanced security measures',
      learningObjectives: [
        'Understand corporate Bluetooth security policies',
        'Learn about enterprise device management',
        'Recognize the importance of security updates',
        'Understand defense-in-depth strategies'
      ],
      prerequisites: [
        'Understanding of basic Bluetooth security',
        'Knowledge of corporate security concepts'
      ],
      deviceCount: devices.length,
      defenseLevel: 70,
      signalRange: 12,
      devices,
      events: [],
      seed: 22222
    };
  }

  // Helper methods for creating specific device types
  private createAttackerDevice(): Device {
    return {
      id: 'attacker',
      name: 'Attacker Device',
      type: 'laptop',
      osFingerprint: 'Kali Linux 2023.3',
      syntheticMac: 'AA:BB:CC:DD:EE:FF',
      signalStrength: 95,
      pairedWith: [],
      vulnerabilityScore: 0, // Attacker is not vulnerable
      location: { x: 50, y: 50 },
      isDiscoverable: false,
      hasPairingProtection: true,
      lastSeen: new Date(),
      status: 'discovered'
    };
  }

  private createVulnerablePhone(name: string, location: { x: number; y: number }): Device {
    return {
      id: `phone_${Date.now()}_${Math.random()}`,
      name,
      type: 'phone',
      osFingerprint: 'Android 11',
      syntheticMac: this.deviceGenerator.generateMac(),
      signalStrength: 80,
      pairedWith: [],
      vulnerabilityScore: 75,
      location,
      isDiscoverable: true,
      hasPairingProtection: false,
      lastSeen: new Date(),
      status: 'vulnerable'
    };
  }

  private createProtectedPhone(name: string, location: { x: number; y: number }): Device {
    return {
      id: `phone_${Date.now()}_${Math.random()}`,
      name,
      type: 'phone',
      osFingerprint: 'iOS 16.6',
      syntheticMac: this.deviceGenerator.generateMac(),
      signalStrength: 85,
      pairedWith: [],
      vulnerabilityScore: 20,
      location,
      isDiscoverable: false,
      hasPairingProtection: true,
      lastSeen: new Date(),
      status: 'protected'
    };
  }

  private createHighlyVulnerablePhone(name: string, location: { x: number; y: number }): Device {
    return {
      id: `phone_${Date.now()}_${Math.random()}`,
      name,
      type: 'phone',
      osFingerprint: 'Android 8.1',
      syntheticMac: this.deviceGenerator.generateMac(),
      signalStrength: 70,
      pairedWith: [],
      vulnerabilityScore: 90,
      location,
      isDiscoverable: true,
      hasPairingProtection: false,
      lastSeen: new Date(),
      status: 'vulnerable'
    };
  }

  private createModeratelyVulnerablePhone(name: string, location: { x: number; y: number }): Device {
    return {
      id: `phone_${Date.now()}_${Math.random()}`,
      name,
      type: 'phone',
      osFingerprint: 'iOS 15.7',
      syntheticMac: this.deviceGenerator.generateMac(),
      signalStrength: 80,
      pairedWith: [],
      vulnerabilityScore: 50,
      location,
      isDiscoverable: true,
      hasPairingProtection: true,
      lastSeen: new Date(),
      status: 'discovered'
    };
  }

  private createPhone(name: string, location: { x: number; y: number }): Device {
    return {
      id: `phone_${Date.now()}_${Math.random()}`,
      name,
      type: 'phone',
      osFingerprint: 'Android 13',
      syntheticMac: this.deviceGenerator.generateMac(),
      signalStrength: 85,
      pairedWith: [],
      vulnerabilityScore: 40,
      location,
      isDiscoverable: true,
      hasPairingProtection: true,
      lastSeen: new Date(),
      status: 'discovered'
    };
  }

  private createHeadset(name: string, location: { x: number; y: number }): Device {
    return {
      id: `headset_${Date.now()}_${Math.random()}`,
      name,
      type: 'headset',
      osFingerprint: 'Bluetooth 5.0',
      syntheticMac: this.deviceGenerator.generateMac(),
      signalStrength: 60,
      pairedWith: [],
      vulnerabilityScore: 30,
      location,
      isDiscoverable: true,
      hasPairingProtection: false,
      lastSeen: new Date(),
      status: 'discovered'
    };
  }

  private createLaptop(name: string, location: { x: number; y: number }): Device {
    return {
      id: `laptop_${Date.now()}_${Math.random()}`,
      name,
      type: 'laptop',
      osFingerprint: 'Windows 11',
      syntheticMac: this.deviceGenerator.generateMac(),
      signalStrength: 90,
      pairedWith: [],
      vulnerabilityScore: 35,
      location,
      isDiscoverable: false,
      hasPairingProtection: true,
      lastSeen: new Date(),
      status: 'discovered'
    };
  }

  private createTablet(name: string, location: { x: number; y: number }): Device {
    return {
      id: `tablet_${Date.now()}_${Math.random()}`,
      name,
      type: 'tablet',
      osFingerprint: 'iPadOS 16',
      syntheticMac: this.deviceGenerator.generateMac(),
      signalStrength: 75,
      pairedWith: [],
      vulnerabilityScore: 25,
      location,
      isDiscoverable: false,
      hasPairingProtection: true,
      lastSeen: new Date(),
      status: 'discovered'
    };
  }

  getAllScenarios(): Scenario[] {
    return [
      this.getBlueJackingScenario(),
      this.getBluesnarfingScenario(),
      this.getMacSpoofingScenario(),
      this.getCrowdedCafeScenario(),
      this.getOfficeEnvironmentScenario()
    ];
  }
}
