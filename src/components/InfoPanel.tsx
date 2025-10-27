import React from 'react';
import { X, Shield, Wifi, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Device } from '../types/simulation';
import './InfoPanel.css';

interface InfoPanelProps {
  device: Device | undefined;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ device, onClose }) => {
  if (!device) return null;

  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'phone': return '📱';
      case 'headset': return '🎧';
      case 'laptop': return '💻';
      case 'tablet': return '📱';
      case 'watch': return '⌚';
      default: return '📱';
    }
  };

  const getStatusIcon = (status: Device['status']) => {
    switch (status) {
      case 'vulnerable': return <AlertTriangle size={16} className="status-icon vulnerable" />;
      case 'protected': return <CheckCircle size={16} className="status-icon protected" />;
      case 'spoofed': return <AlertTriangle size={16} className="status-icon spoofed" />;
      case 'paired': return <CheckCircle size={16} className="status-icon paired" />;
      default: return <Clock size={16} className="status-icon discovered" />;
    }
  };

  const getVulnerabilityLevel = (score: number) => {
    if (score > 75) return { level: 'High', color: '#ff6b6b' };
    if (score > 50) return { level: 'Medium', color: '#ffd93d' };
    if (score > 25) return { level: 'Low', color: '#4ecdc4' };
    return { level: 'Minimal', color: '#96ceb4' };
  };

  const vulnerability = getVulnerabilityLevel(device.vulnerabilityScore);

  return (
    <div className="info-panel-overlay">
      <div className="info-panel">
        <div className="panel-header">
          <div className="device-title">
            <span className="device-icon">{getDeviceIcon(device.type)}</span>
            <div className="title-text">
              <h3>{device.name}</h3>
              <div className="device-status">
                {getStatusIcon(device.status)}
                <span className="status-text">{device.status}</span>
              </div>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="panel-content">
          <div className="info-section">
            <h4>Device Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{device.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">MAC Address:</span>
                <span className="info-value mac-address">{device.syntheticMac}</span>
              </div>
              <div className="info-item">
                <span className="info-label">OS Fingerprint:</span>
                <span className="info-value">{device.osFingerprint}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Seen:</span>
                <span className="info-value">{device.lastSeen.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Security Status</h4>
            <div className="security-grid">
              <div className="security-item">
                <div className="security-header">
                  <Shield size={16} />
                  <span>Vulnerability Score</span>
                </div>
                <div className="vulnerability-display">
                  <div className="score-bar">
                    <div 
                      className="score-fill"
                      style={{ 
                        width: `${device.vulnerabilityScore}%`,
                        backgroundColor: vulnerability.color
                      }}
                    />
                  </div>
                  <span 
                    className="score-text"
                    style={{ color: vulnerability.color }}
                  >
                    {device.vulnerabilityScore}/100 ({vulnerability.level})
                  </span>
                </div>
              </div>

              <div className="security-item">
                <div className="security-header">
                  <Wifi size={16} />
                  <span>Signal Strength</span>
                </div>
                <div className="signal-display">
                  <div className="signal-bar">
                    <div 
                      className="signal-fill"
                      style={{ width: `${device.signalStrength}%` }}
                    />
                  </div>
                  <span className="signal-text">{device.signalStrength}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Configuration</h4>
            <div className="config-grid">
              <div className="config-item">
                <span className="config-label">Discoverable:</span>
                <span className={`config-value ${device.isDiscoverable ? 'enabled' : 'disabled'}`}>
                  {device.isDiscoverable ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="config-item">
                <span className="config-label">Pairing Protection:</span>
                <span className={`config-value ${device.hasPairingProtection ? 'enabled' : 'disabled'}`}>
                  {device.hasPairingProtection ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="config-item">
                <span className="config-label">Paired Devices:</span>
                <span className="config-value">
                  {device.pairedWith.length > 0 ? device.pairedWith.length : 'None'}
                </span>
              </div>
            </div>
          </div>

          {device.pairedWith.length > 0 && (
            <div className="info-section">
              <h4>Paired Devices</h4>
              <div className="paired-list">
                {device.pairedWith.map((pairedId, index) => (
                  <div key={index} className="paired-item">
                    <span className="paired-id">{pairedId}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="info-section">
            <h4>Location</h4>
            <div className="location-info">
              <div className="coordinate">
                <span className="coord-label">X:</span>
                <span className="coord-value">{Math.round(device.location.x)}</span>
              </div>
              <div className="coordinate">
                <span className="coord-label">Y:</span>
                <span className="coord-value">{Math.round(device.location.y)}</span>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h4>Security Recommendations</h4>
            <div className="recommendations">
              {device.vulnerabilityScore > 50 && (
                <div className="recommendation-item">
                  <AlertTriangle size={14} />
                  <span>High vulnerability detected. Consider updating firmware and enabling additional security measures.</span>
                </div>
              )}
              {!device.hasPairingProtection && (
                <div className="recommendation-item">
                  <Shield size={14} />
                  <span>Enable pairing protection to prevent unauthorized connections.</span>
                </div>
              )}
              {device.isDiscoverable && (
                <div className="recommendation-item">
                  <Wifi size={14} />
                  <span>Consider disabling discoverable mode when not actively pairing devices.</span>
                </div>
              )}
              {device.vulnerabilityScore <= 25 && device.hasPairingProtection && !device.isDiscoverable && (
                <div className="recommendation-item">
                  <CheckCircle size={14} />
                  <span>Device appears to be well-configured with good security practices.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
