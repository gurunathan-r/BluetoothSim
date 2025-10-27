import React, { useState } from 'react';
import { AlertTriangle, Shield, BookOpen, Users } from 'lucide-react';
import './SafetyDisclaimer.css';

interface SafetyDisclaimerProps {
  onAcknowledge: () => void;
}

const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ onAcknowledge }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false);

  const handleAcknowledge = () => {
    if (isAcknowledged) {
      onAcknowledge();
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAcknowledged(e.target.checked);
  };

  return (
    <div className="safety-disclaimer">
      <div className="disclaimer-content">
        <div className="disclaimer-header">
          <AlertTriangle className="warning-icon" size={48} />
          <h1>Educational Use Only</h1>
        </div>

        <div className="disclaimer-body">
          <div className="warning-section">
            <h2>⚠️ Important Safety Notice</h2>
            <p>
              This application is designed <strong>exclusively for educational and training purposes</strong>. 
              All Bluetooth interactions, commands, and results are <strong>completely simulated</strong> 
              and have <strong>no real-world effects</strong>.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <Shield className="feature-icon" size={32} />
              <h3>100% Simulation</h3>
              <p>
                No real Bluetooth hardware is accessed or modified. 
                All commands are purely visual demonstrations.
              </p>
            </div>

            <div className="feature-card">
              <BookOpen className="feature-icon" size={32} />
              <h3>Educational Focus</h3>
              <p>
                Learn about Bluetooth security concepts, vulnerabilities, 
                and defensive measures in a safe environment.
              </p>
            </div>

            <div className="feature-card">
              <Users className="feature-icon" size={32} />
              <h3>Ethical Training</h3>
              <p>
                Understand cybersecurity principles without the risk 
                of causing harm to real devices or networks.
              </p>
            </div>
          </div>

          <div className="prohibited-uses">
            <h3>🚫 Prohibited Uses</h3>
            <ul>
              <li>Attempting to use simulated commands on real devices</li>
              <li>Using this tool to target actual Bluetooth devices</li>
              <li>Extracting or modifying real hardware configurations</li>
              <li>Any malicious or unauthorized activities</li>
            </ul>
          </div>

          <div className="learning-objectives">
            <h3>🎯 Learning Objectives</h3>
            <ul>
              <li>Understand Bluetooth security vulnerabilities</li>
              <li>Learn about common attack vectors (BlueJacking, Bluesnarfing, MAC spoofing)</li>
              <li>Recognize defensive measures and best practices</li>
              <li>Develop awareness of wireless security risks</li>
            </ul>
          </div>

          <div className="acknowledgment-section">
            <div className="checkbox-container">
              <input 
                type="checkbox" 
                id="acknowledge-checkbox" 
                className="acknowledge-checkbox"
                checked={isAcknowledged}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="acknowledge-checkbox">
                I understand that this is an educational simulation tool and will not use it 
                to target real devices or perform unauthorized activities.
              </label>
            </div>

            <button 
              className="acknowledge-button"
              onClick={handleAcknowledge}
              disabled={!isAcknowledged}
            >
              I Acknowledge - Enter Simulation Lab
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyDisclaimer;
