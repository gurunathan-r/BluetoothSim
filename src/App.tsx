import React, { useState, useEffect } from 'react';
import { SimulationEngine } from './engine/SimulationEngine';
import { ScenarioLibrary } from './scenarios/ScenarioLibrary';
import { Scenario, SimulationState } from './types/simulation';
import SafetyDisclaimer from './components/SafetyDisclaimer';
import EthicsQuiz from './components/EthicsQuiz';
import TerminalPane from './components/TerminalPane';
import TopologyCanvas from './components/TopologyCanvas';
import ScenarioControls from './components/ScenarioControls';
import InfoPanel from './components/InfoPanel';
import './App.css';

function App() {
  const [simulationEngine] = useState(() => new SimulationEngine());
  const [scenarioLibrary] = useState(() => new ScenarioLibrary());
  const [simulationState, setSimulationState] = useState<SimulationState>(simulationEngine.getState());
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [showSafetyDisclaimer, setShowSafetyDisclaimer] = useState(false);
  const [showEthicsQuiz, setShowEthicsQuiz] = useState(false);
  const [hasPassedEthicsQuiz, setHasPassedEthicsQuiz] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  useEffect(() => {
    // Load saved state from localStorage
    const savedState = localStorage.getItem('bluetooth-sim-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setHasPassedEthicsQuiz(parsed.hasPassedEthicsQuiz || false);
        setIsAdvancedMode(parsed.isAdvancedMode || false);
      } catch (error) {
        console.warn('Failed to load saved state:', error);
      }
    }
  }, []);

  const handleScenarioSelect = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    simulationEngine.state.currentScenario = scenario;
    simulationEngine.state.devices.clear();
    simulationEngine.state.events = [];
    simulationEngine.state.logs = [];

    // Add devices to simulation
    scenario.devices.forEach(device => {
      simulationEngine.state.devices.set(device.id, device);
    });

    setSimulationState(simulationEngine.getState());

    // Automatically start simulation with scenario-specific demo
    setTimeout(() => {
      const templates = simulationEngine.getCommandTemplates();
      
      // Skip initial scan for MAC spoofing scenario to show only paired connections
      if (scenario.id !== 'mac_spoofing_demo') {
        // Initial scan
        const scanTemplate = templates.find(t => t.id === 'scan');
        if (scanTemplate) {
          simulationEngine.executeCommand(scanTemplate, { 
            range: scenario.signalRange.toString(),
            filter: 'all'
          });
        }
      }

      // Scenario-specific demo commands
      setTimeout(() => {
        if (scenario.id === 'mac_spoofing_demo') {
          const setMacTemplate = templates.find(t => t.id === 'set_mac');
          if (setMacTemplate) {
            simulationEngine.executeCommand(setMacTemplate, {
              device: 'attacker',
              mac: 'AA:BB:CC:DD:EE:FF'
            });
          }
        }

        setSimulationState(simulationEngine.getState());
      }, 2000); // 2 second delay for demo command

      setSimulationState(simulationEngine.getState());
    }, 1000); // 1 second delay to let the UI update
  };

  const handleCommandExecute = (templateId: string, params: Record<string, any>) => {
    const templates = simulationEngine.getCommandTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      const events = simulationEngine.executeCommand(template, params);
      setSimulationState(simulationEngine.getState());
      
      // Trigger animations/updates in topology canvas
      // This will be handled by the TopologyCanvas component
    }
  };

  const handleSafetyAcknowledged = () => {
    setShowSafetyDisclaimer(false);
    // Removed ethics quiz requirement
  };

  const handleEthicsQuizPassed = () => {
    setHasPassedEthicsQuiz(true);
    setShowEthicsQuiz(false);
    
    // Save state
    localStorage.setItem('bluetooth-sim-state', JSON.stringify({
      hasPassedEthicsQuiz: true,
      isAdvancedMode: true
    }));
  };

  const handleEthicsQuizFailed = () => {
    setIsAdvancedMode(false);
    setShowEthicsQuiz(false);
  };

  const handleAdvancedModeToggle = (enabled: boolean) => {
    setIsAdvancedMode(enabled);
    // Removed ethics quiz requirement
  };

  // Removed ethics quiz - all features are now available

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bluetooth Simulation Lab</h1>
        <p className="subtitle">Educational Cybersecurity Training Platform</p>
        <div className="header-controls">
          <label className="advanced-mode-toggle">
            <input
              type="checkbox"
              checked={isAdvancedMode}
              onChange={(e) => handleAdvancedModeToggle(e.target.checked)}
            />
            Advanced Mode
          </label>
        </div>
      </header>

      <main className="app-main">
        <div className="top-section">
          <div className="left-pane">
            <TerminalPane
              simulationEngine={simulationEngine}
              onCommandExecute={handleCommandExecute}
              logs={simulationState.logs}
              isAdvancedMode={isAdvancedMode}
            />
          </div>

          <div className="right-pane">
            <TopologyCanvas
              devices={simulationState.devices}
              events={simulationState.events}
              onDeviceSelect={setSelectedDevice}
              selectedDevice={selectedDevice}
              currentScenario={currentScenario}
            />
          </div>
        </div>

        <div className="bottom-pane">
          <ScenarioControls
            scenarios={scenarioLibrary.getAllScenarios()}
            currentScenario={currentScenario}
            onScenarioSelect={handleScenarioSelect}
            simulationEngine={simulationEngine}
            isAdvancedMode={isAdvancedMode}
          />
        </div>
      </main>

      {selectedDevice && (
        <InfoPanel
          device={simulationState.devices.get(selectedDevice)}
          onClose={() => setSelectedDevice(null)}
        />
      )}
    </div>
  );
}

export default App;