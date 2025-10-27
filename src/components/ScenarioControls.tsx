import React, { useState } from 'react';
import { Play, Settings, BookOpen, Shield, Users, Wifi } from 'lucide-react';
import { Scenario, SimulationEngine } from '../types/simulation';
import { ScenarioLibrary } from '../scenarios/ScenarioLibrary';
import './ScenarioControls.css';

interface ScenarioControlsProps {
  scenarios: Scenario[];
  currentScenario: Scenario | null;
  onScenarioSelect: (scenario: Scenario) => void;
  simulationEngine: SimulationEngine;
  isAdvancedMode: boolean;
}

const ScenarioControls: React.FC<ScenarioControlsProps> = ({
  scenarios,
  currentScenario,
  onScenarioSelect,
  simulationEngine,
  isAdvancedMode
}) => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    deviceCount: 5,
    defenseLevel: 50,
    signalRange: 10,
    scenarioName: 'Custom Scenario'
  });

  const handleScenarioSelect = (scenario: Scenario) => {
    onScenarioSelect(scenario);
  };

  const handleCustomScenarioCreate = () => {
    const customScenario = simulationEngine.createScenario(
      customSettings.scenarioName,
      customSettings.deviceCount,
      customSettings.defenseLevel
    );
    onScenarioSelect(customScenario);
    setShowCustomizer(false);
  };

  const getScenarioIcon = (scenarioId: string) => {
    switch (scenarioId) {
      case 'bluejacking_demo': return <Users size={20} />;
      case 'bluesnarfing_demo': return <Shield size={20} />;
      case 'mac_spoofing_demo': return <Settings size={20} />;
      case 'crowded_cafe': return <Users size={20} />;
      case 'office_environment': return <BookOpen size={20} />;
      default: return <Play size={20} />;
    }
  };

  const getScenarioDifficulty = (scenario: Scenario) => {
    if (scenario.defenseLevel > 60) return 'Hard';
    if (scenario.defenseLevel > 30) return 'Medium';
    return 'Easy';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Hard': return '#ff6b6b';
      case 'Medium': return '#ffd93d';
      case 'Easy': return '#4ecdc4';
      default: return '#8b949e';
    }
  };

  return (
    <div className="scenario-controls">
      <div className="controls-header">
        <h3>Scenario Selection</h3>
        <div className="header-actions">
          <button 
            className="customize-button"
            onClick={() => setShowCustomizer(!showCustomizer)}
          >
            <Settings size={16} />
            Customize
          </button>
        </div>
      </div>

      <div className="controls-content">
        <div className="scenario-grid">
          {scenarios.map(scenario => (
            <div 
              key={scenario.id}
              className={`scenario-card ${currentScenario?.id === scenario.id ? 'active' : ''}`}
              onClick={() => handleScenarioSelect(scenario)}
            >
              <div className="scenario-header">
                <div className="scenario-icon">
                  {getScenarioIcon(scenario.id)}
                </div>
                <div className="scenario-title">
                  <h4>{scenario.name}</h4>
                  <span 
                    className="difficulty-badge"
                    style={{ color: getDifficultyColor(getScenarioDifficulty(scenario)) }}
                  >
                    {getScenarioDifficulty(scenario)}
                  </span>
                </div>
              </div>
              
              <div className="scenario-description">
                <p>{scenario.description}</p>
              </div>
              
              <div className="scenario-stats">
                <div className="stat-item">
                  <Users size={14} />
                  <span>{scenario.deviceCount} devices</span>
                </div>
                <div className="stat-item">
                  <Shield size={14} />
                  <span>{scenario.defenseLevel}% defense</span>
                </div>
                <div className="stat-item">
                  <Wifi size={14} />
                  <span>{scenario.signalRange}m range</span>
                </div>
              </div>
              
              <div className="scenario-objectives">
                <h5>Learning Objectives:</h5>
                <ul>
                  {scenario.learningObjectives.slice(0, 2).map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                  {scenario.learningObjectives.length > 2 && (
                    <li>+{scenario.learningObjectives.length - 2} more...</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {showCustomizer && (
          <div className="custom-scenario-panel">
            <h4>Create Custom Scenario</h4>
            
            <div className="custom-settings">
              <div className="setting-group">
                <label htmlFor="scenario-name">Scenario Name</label>
                <input
                  id="scenario-name"
                  type="text"
                  value={customSettings.scenarioName}
                  onChange={(e) => setCustomSettings(prev => ({
                    ...prev,
                    scenarioName: e.target.value
                  }))}
                  placeholder="Enter scenario name"
                />
              </div>
              
              <div className="setting-group">
                <label htmlFor="device-count">Device Count: {customSettings.deviceCount}</label>
                <input
                  id="device-count"
                  type="range"
                  min="3"
                  max="20"
                  value={customSettings.deviceCount}
                  onChange={(e) => setCustomSettings(prev => ({
                    ...prev,
                    deviceCount: parseInt(e.target.value)
                  }))}
                />
              </div>
              
              <div className="setting-group">
                <label htmlFor="defense-level">Defense Level: {customSettings.defenseLevel}%</label>
                <input
                  id="defense-level"
                  type="range"
                  min="0"
                  max="100"
                  value={customSettings.defenseLevel}
                  onChange={(e) => setCustomSettings(prev => ({
                    ...prev,
                    defenseLevel: parseInt(e.target.value)
                  }))}
                />
              </div>
              
              <div className="setting-group">
                <label htmlFor="signal-range">Signal Range: {customSettings.signalRange}m</label>
                <input
                  id="signal-range"
                  type="range"
                  min="5"
                  max="50"
                  value={customSettings.signalRange}
                  onChange={(e) => setCustomSettings(prev => ({
                    ...prev,
                    signalRange: parseInt(e.target.value)
                  }))}
                />
              </div>
            </div>
            
            <div className="custom-actions">
              <button 
                className="create-button"
                onClick={handleCustomScenarioCreate}
              >
                <Play size={16} />
                Create Scenario
              </button>
              <button 
                className="cancel-button"
                onClick={() => setShowCustomizer(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {currentScenario && (
        <div className="current-scenario-info">
          <h4>Current Scenario: {currentScenario.name}</h4>
          <div className="scenario-details">
            <div className="detail-section">
              <h5>Learning Objectives</h5>
              <ul>
                {currentScenario.learningObjectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
            
            <div className="detail-section">
              <h5>Prerequisites</h5>
              <ul>
                {currentScenario.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </div>
            
            <div className="detail-section">
              <h5>Scenario Parameters</h5>
              <div className="parameter-grid">
                <div className="parameter">
                  <span className="param-label">Devices:</span>
                  <span className="param-value">{currentScenario.deviceCount}</span>
                </div>
                <div className="parameter">
                  <span className="param-label">Defense Level:</span>
                  <span className="param-value">{currentScenario.defenseLevel}%</span>
                </div>
                <div className="parameter">
                  <span className="param-label">Signal Range:</span>
                  <span className="param-value">{currentScenario.signalRange}m</span>
                </div>
                <div className="parameter">
                  <span className="param-label">Seed:</span>
                  <span className="param-value">{currentScenario.seed}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioControls;
