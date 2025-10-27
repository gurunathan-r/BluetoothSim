import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Device, SimulationEvent, Scenario } from '../types/simulation';
import './TopologyCanvas.css';

interface TopologyCanvasProps {
  devices: Map<string, Device>;
  events: SimulationEvent[];
  onDeviceSelect: (deviceId: string) => void;
  selectedDevice: string | null;
  currentScenario: Scenario | null;
}

interface DeviceNode {
  id: string;
  device: Device;
  x: number;
  y: number;
  radius: number;
}

interface Connection {
  id: string;
  source: string;
  target: string;
  type: 'discovery' | 'message' | 'data_access' | 'spoof' | 'defense';
  active: boolean;
  timestamp: Date;
}

const TopologyCanvas: React.FC<TopologyCanvasProps> = ({
  devices,
  events,
  onDeviceSelect,
  selectedDevice,
  currentScenario
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [deviceNodes, setDeviceNodes] = useState<DeviceNode[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);

  // Device type icons and colors
  const deviceConfig = {
    phone: { icon: '📱', color: '#4ecdc4', radius: 25 },
    headset: { icon: '🎧', color: '#45b7d1', radius: 20 },
    laptop: { icon: '💻', color: '#96ceb4', radius: 30 },
    tablet: { icon: '📱', color: '#feca57', radius: 28 },
    watch: { icon: '⌚', color: '#ff9ff3', radius: 18 },
    attacker: { icon: '⚡', color: '#ff6b6b', radius: 30 }
  };

  const getDeviceConfig = (device: Device) => {
    if (device.id === 'attacker') {
      return deviceConfig.attacker;
    }
    return deviceConfig[device.type] || deviceConfig.phone;
  };

  const getDeviceStatusColor = (device: Device) => {
    switch (device.status) {
      case 'vulnerable': return '#ff6b6b';
      case 'protected': return '#4ecdc4';
      case 'spoofed': return '#ffd93d';
      case 'paired': return '#96ceb4';
      default: return '#8b949e';
    }
  };

  useEffect(() => {
    // Convert devices to nodes - create new array to ensure React detects changes
    const nodes: DeviceNode[] = Array.from(devices.values()).map(device => ({
      id: device.id,
      device: { ...device }, // Create shallow copy to ensure change detection
      x: device.location.x,
      y: device.location.y,
      radius: getDeviceConfig(device).radius
    }));
    setDeviceNodes(nodes);
  }, [devices]);

  useEffect(() => {
    // Process events to create connections
    const newConnections: Connection[] = [];
    
    events.forEach(event => {
      if (event.targetDevice) {
        const connection: Connection = {
          id: `conn-${event.id}`,
          source: event.sourceDevice,
          target: event.targetDevice,
          type: event.type as Connection['type'],
          active: true,
          timestamp: event.timestamp
        };
        newConnections.push(connection);
      }
    });
    
    setConnections(newConnections);
  }, [events]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create main group
    const mainGroup = svg.append('g');

    // Add background grid
    const gridSize = 50;
    const gridPattern = svg.append('defs')
      .append('pattern')
      .attr('id', 'grid')
      .attr('width', gridSize)
      .attr('height', gridSize)
      .attr('patternUnits', 'userSpaceOnUse');

    gridPattern.append('path')
      .attr('d', `M ${gridSize} 0 L 0 0 0 ${gridSize}`)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 255, 255, 0.1)')
      .attr('stroke-width', 1);

    svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'url(#grid)');

    // Draw connections
    connections.forEach(connection => {
      const sourceNode = deviceNodes.find(n => n.id === connection.source);
      const targetNode = deviceNodes.find(n => n.id === connection.target);
      
      if (sourceNode && targetNode) {
        const line = mainGroup.append('line')
          .attr('x1', sourceNode.x)
          .attr('y1', sourceNode.y)
          .attr('x2', targetNode.x)
          .attr('y2', targetNode.y)
          .attr('stroke', getConnectionColor(connection.type))
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '5,5')
          .attr('opacity', 0.7);

        // Animate connection
        line.transition()
          .duration(1000)
          .attr('opacity', 0)
          .remove();
      }
    });

    // Draw devices
    deviceNodes.forEach(node => {
      const config = getDeviceConfig(node.device);
      const statusColor = getDeviceStatusColor(node.device);
      
      // Device circle
      const deviceGroup = mainGroup.append('g')
        .attr('class', 'device-group')
        .attr('transform', `translate(${node.x}, ${node.y})`)
        .style('cursor', 'pointer');

      // Signal range circle (if discoverable)
      if (node.device.isDiscoverable) {
        deviceGroup.append('circle')
          .attr('r', 60)
          .attr('fill', 'none')
          .attr('stroke', config.color)
          .attr('stroke-width', 2)
          .attr('opacity', 0.3)
          .attr('stroke-dasharray', '3,3');
      }

      // Device background circle
      deviceGroup.append('circle')
        .attr('r', node.radius)
        .attr('fill', config.color)
        .attr('stroke', statusColor)
        .attr('stroke-width', 3)
        .attr('opacity', 0.9);

      // Device icon/text
      deviceGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', node.radius * 0.8)
        .text(config.icon);

      // Device name
      deviceGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', node.radius + 20)
        .attr('font-size', '12px')
        .attr('fill', '#ffffff')
        .text(node.device.name);

      // MAC address
      deviceGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', node.radius + 35)
        .attr('font-size', '10px')
        .attr('fill', '#8b949e')
        .text(node.device.syntheticMac);

      // Status indicators - completely separate positioning to avoid any overlap
      let yOffset = 0;
      const indicatorSize = 12;
      const indicatorGap = 25;
      const rightOffset = node.radius + 35;

      // Vulnerability indicator - positioned at top right
      if (node.device.vulnerabilityScore > 50) {
        deviceGroup.append('circle')
          .attr('r', indicatorSize)
          .attr('cx', rightOffset)
          .attr('cy', -node.radius + yOffset)
          .attr('fill', '#ff6b6b')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 3)
          .attr('opacity', 0.9);
        
        deviceGroup.append('text')
          .attr('x', rightOffset)
          .attr('y', -node.radius + yOffset)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-size', '14px')
          .attr('fill', '#ffffff')
          .attr('font-weight', 'bold')
          .text('!');
        
        yOffset += indicatorGap;
      }

      // Protection indicator - positioned below vulnerability
      if (node.device.hasPairingProtection) {
        deviceGroup.append('circle')
          .attr('r', indicatorSize)
          .attr('cx', rightOffset)
          .attr('cy', -node.radius + yOffset)
          .attr('fill', '#4ecdc4')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 3)
          .attr('opacity', 0.9);
        
        deviceGroup.append('text')
          .attr('x', rightOffset)
          .attr('y', -node.radius + yOffset)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-size', '14px')
          .attr('fill', '#ffffff')
          .attr('font-weight', 'bold')
          .text('✓');
        
        yOffset += indicatorGap;
      }

      // Spoofed indicator - positioned below protection
      if (node.device.status === 'spoofed') {
        deviceGroup.append('circle')
          .attr('r', indicatorSize)
          .attr('cx', rightOffset)
          .attr('cy', -node.radius + yOffset)
          .attr('fill', '#ffd93d')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 3)
          .attr('opacity', 0.9);
        
        deviceGroup.append('text')
          .attr('x', rightOffset)
          .attr('y', -node.radius + yOffset)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('font-size', '14px')
          .attr('fill', '#000000')
          .attr('font-weight', 'bold')
          .text('S');
        
        yOffset += indicatorGap;
      }

      // Click handler
      deviceGroup.on('click', () => {
        onDeviceSelect(node.id);
      });

      // Hover effects
      deviceGroup.on('mouseenter', function() {
        d3.select(this).selectAll('circle')
          .filter(function(d, i) { return i === 0; }) // Select first circle (device background)
          .transition()
          .duration(200)
          .attr('r', node.radius + 5)
          .attr('opacity', 1);
      });

      deviceGroup.on('mouseleave', function() {
        d3.select(this).selectAll('circle')
          .filter(function(d, i) { return i === 0; }) // Select first circle (device background)
          .transition()
          .duration(200)
          .attr('r', node.radius)
          .attr('opacity', 0.9);
      });
    });

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(20, 20)');

    legend.append('text')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .text('Device Status');

    const legendItems = [
      { color: '#ff6b6b', label: 'Vulnerable' },
      { color: '#4ecdc4', label: 'Protected' },
      { color: '#ffd93d', label: 'Spoofed' },
      { color: '#96ceb4', label: 'Paired' },
      { color: '#8b949e', label: 'Discovered' }
    ];

    legendItems.forEach((item, index) => {
      const itemGroup = legend.append('g')
        .attr('transform', `translate(0, ${25 + index * 20})`);

      itemGroup.append('circle')
        .attr('r', 6)
        .attr('fill', item.color);

      itemGroup.append('text')
        .attr('x', 15)
        .attr('dy', '0.35em')
        .attr('font-size', '12px')
        .attr('fill', '#ffffff')
        .text(item.label);
    });

  }, [deviceNodes, connections, selectedDevice, animationFrame, devices]);

  const getConnectionColor = (type: Connection['type']) => {
    switch (type) {
      case 'discovery': return '#58a6ff';
      case 'message': return '#ffd93d';
      case 'data_access': return '#ff6b6b';
      case 'spoof': return '#ff9ff3';
      case 'defense': return '#4ecdc4';
      default: return '#8b949e';
    }
  };

  // Trigger re-render for animations and force updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 500); // More frequent updates
    
    return () => clearInterval(interval);
  }, []);

  // Force immediate re-render when devices change
  useEffect(() => {
    setAnimationFrame(prev => prev + 1);
  }, [devices]);

  return (
    <div className="topology-canvas">
      <div className="canvas-header">
        <h3>Network Topology</h3>
        <div className="canvas-info">
          <span className="device-count">{devices.size} Devices</span>
          <span className="event-count">{events.length} Events</span>
        </div>
      </div>
      
      <div className="canvas-content">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 500 400"
          preserveAspectRatio="xMidYMid meet"
          key={`topology-${animationFrame}`}
        />
      </div>
      
      {currentScenario && (
        <div className="scenario-info">
          <h4>{currentScenario.name}</h4>
          <p>{currentScenario.description}</p>
          <div className="scenario-stats">
            <span>Defense Level: {currentScenario.defenseLevel}%</span>
            <span>Signal Range: {currentScenario.signalRange}m</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopologyCanvas;
