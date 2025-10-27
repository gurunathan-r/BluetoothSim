import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Play, Square, HelpCircle, Clock } from 'lucide-react';
import { SimulationEngine } from '../engine/SimulationEngine';
import { CommandTemplate } from '../types/simulation';
import './TerminalPane.css';

interface TerminalPaneProps {
  simulationEngine: SimulationEngine;
  onCommandExecute: (templateId: string, params: Record<string, any>) => void;
  logs: string[];
  isAdvancedMode: boolean;
}

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'info';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const TerminalPane: React.FC<TerminalPaneProps> = ({
  simulationEngine,
  onCommandExecute,
  logs,
  isAdvancedMode
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandTemplates = simulationEngine.getCommandTemplates();

  useEffect(() => {
    // Add welcome message
    const welcomeLines: TerminalLine[] = [
      {
        id: 'welcome-1',
        type: 'info',
        content: 'Bluetooth Simulation Lab - Educational Terminal',
        timestamp: new Date()
      },
      {
        id: 'welcome-2',
        type: 'info',
        content: 'All commands are SIMULATED and have NO REAL EFFECTS',
        timestamp: new Date()
      },
      {
        id: 'welcome-3',
        type: 'info',
        content: 'Select a scenario below to start the simulation automatically',
        timestamp: new Date()
      },
      {
        id: 'welcome-4',
        type: 'info',
        content: 'Type "help" to see available commands or "help <command>" for details',
        timestamp: new Date()
      }
    ];
    setLines(welcomeLines);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new lines are added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    // Add new logs as terminal lines
    if (logs.length > 0) {
      const newLogs = logs.slice(lines.length - 4); // Only show new logs
      const logLines: TerminalLine[] = newLogs.map((log, index) => ({
        id: `log-${Date.now()}-${index}`,
        type: 'output',
        content: log,
        timestamp: new Date()
      }));
      setLines(prev => [...prev, ...logLines]);
    }
  }, [logs]);

  const addLine = (line: TerminalLine) => {
    setLines(prev => [...prev, line]);
  };

  const typewriterEffect = async (text: string, type: TerminalLine['type'] = 'output'): Promise<void> => {
    return new Promise((resolve) => {
      const lineId = `typing-${Date.now()}`;
      const line: TerminalLine = {
        id: lineId,
        type,
        content: '',
        timestamp: new Date(),
        isTyping: true
      };
      
      setLines(prev => [...prev, line]);
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setLines(prev => 
            prev.map(l => 
              l.id === lineId 
                ? { ...l, content: text.slice(0, index + 1) }
                : l
            )
          );
          index++;
        } else {
          clearInterval(interval);
          setLines(prev => 
            prev.map(l => 
              l.id === lineId 
                ? { ...l, isTyping: false }
                : l
            )
          );
          resolve();
        }
      }, 30); // 30ms delay between characters
    });
  };

  const parseCommand = (command: string): { templateId: string; params: Record<string, any> } | null => {
    // Improved command parsing that handles quotes and angle brackets
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < command.length; i++) {
      const char = command[i];
      
      if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
        quoteChar = '';
      } else if (char === ' ' && !inQuotes) {
        if (current.trim()) {
          parts.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      parts.push(current.trim());
    }
    
    // Extract command name (should be "sim" + actual command)
    if (parts[0] !== 'sim') {
      return null;
    }
    
    const commandName = parts[1]; // The actual command after "sim"
    
    // Find matching template - handle both template format and ID
    const template = commandTemplates.find(t => {
      const templateCommand = t.template.split(' ')[1];
      return templateCommand === commandName || t.id === commandName;
    });
    
    if (!template) return null;
    
    // Parse parameters (starting from index 2 since we have "sim" and command name)
    const params: Record<string, any> = {};
    for (let i = 2; i < parts.length; i++) {
      const part = parts[i];
      if (part.startsWith('--')) {
        // Check if the parameter contains an equals sign
        if (part.includes('=')) {
          const [key, ...valueParts] = part.substring(2).split('=');
          const value = valueParts.join('='); // Rejoin in case value contains '='
          // Remove angle brackets if present and clean quotes
          const cleanValue = value.replace(/^<|>$/g, '').replace(/^["']|["']$/g, '');
          params[key] = cleanValue;
        } else {
          const key = part.slice(2);
          const value = parts[i + 1];
          if (value && !value.startsWith('--')) {
            // Remove angle brackets if present and clean quotes
            const cleanValue = value.replace(/^<|>$/g, '').replace(/^["']|["']$/g, '');
            params[key] = cleanValue;
            i++; // Skip the value
          } else {
            params[key] = true;
          }
        }
      }
    }
    
    return { templateId: template.id, params };
  };

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;
    
    setIsExecuting(true);
    
    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Add command line
    addLine({
      id: `cmd-${Date.now()}`,
      type: 'command',
      content: `$ ${command}`,
      timestamp: new Date()
    });
    
    // Clear input
    setCurrentCommand('');
    
    // Handle special commands
    if (command === 'help') {
      await typewriterEffect('Available commands:', 'info');
      await typewriterEffect('');
      
      for (let i = 0; i < commandTemplates.length; i++) {
        const template = commandTemplates[i];
        await typewriterEffect(`${template.template} - ${template.description}`);
        if (i < commandTemplates.length - 1) {
          await typewriterEffect('');
        }
      }
      
      await typewriterEffect('');
      await typewriterEffect('All commands are SIMULATED and have NO REAL EFFECTS');
      setIsExecuting(false);
      return;
    }
    
    if (command.startsWith('help ')) {
      const helpCommand = command.slice(5);
      const template = commandTemplates.find(t => t.id === helpCommand);
      
      if (template) {
        await typewriterEffect(`Help for: ${template.template}`);
        await typewriterEffect('');
        await typewriterEffect(`Description: ${template.description}`);
        await typewriterEffect(`Category: ${template.category}`);
        await typewriterEffect('');
        await typewriterEffect('This command is SIMULATED and has NO REAL EFFECTS');
      } else {
        await typewriterEffect(`Unknown command: ${helpCommand}`, 'error');
      }
      
      setIsExecuting(false);
      return;
    }
    
    if (command === 'clear') {
      setLines([]);
      setIsExecuting(false);
      return;
    }
    
    // Parse and execute simulation command
    const parsed = parseCommand(command);
    
    if (!parsed) {
      await typewriterEffect(`Unknown command: ${command}`, 'error');
      await typewriterEffect('Type "help" to see available commands', 'info');
      setIsExecuting(false);
      return;
    }
    
    // Check if command is available in current mode
    // Removed ethics quiz requirement - all commands are now available
    
    try {
      // Execute the command
      onCommandExecute(parsed.templateId, parsed.params);
      
      // Add success message
      await typewriterEffect('Command executed successfully (SIMULATED)', 'info');
      
    } catch (error) {
      await typewriterEffect(`Error: ${error}`, 'error');
    }
    
    setIsExecuting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isExecuting) {
      executeCommand(currentCommand);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion
      const current = currentCommand.toLowerCase();
      const matches = commandTemplates.filter(t => 
        t.template.toLowerCase().includes(current) || 
        t.id.toLowerCase().startsWith(current)
      );
      
      if (matches.length === 1) {
        setCurrentCommand(matches[0].template.split(' ')[1] + ' ');
      }
    }
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="terminal-pane">
      <div className="terminal-header">
        <div className="terminal-title">
          <Terminal size={20} />
          <span>Simulation Terminal</span>
        </div>
        <div className="terminal-controls">
          <button 
            className="control-button"
            onClick={() => setShowHelp(!showHelp)}
            title="Show/Hide Help"
          >
            <HelpCircle size={16} />
          </button>
          <button 
            className="control-button"
            onClick={() => setLines([])}
            title="Clear Terminal"
          >
            <Square size={16} />
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="help-panel">
          <h4>Quick Help</h4>
          <div className="help-content">
            <p><strong>Available Commands:</strong></p>
            <ul>
              {commandTemplates.map(template => (
                <li key={template.id}>
                  <code>{template.template}</code> - {template.description}
                </li>
              ))}
            </ul>
            <p><strong>Special Commands:</strong></p>
            <ul>
              <li><code>help</code> - Show all commands</li>
              <li><code>help &lt;command&gt;</code> - Show command details</li>
              <li><code>clear</code> - Clear terminal</li>
            </ul>
            <p><strong>Navigation:</strong></p>
            <ul>
              <li>↑/↓ - Command history</li>
              <li>TAB - Command completion</li>
              <li>Enter - Execute command</li>
            </ul>
          </div>
        </div>
      )}

      <div className="terminal-content" ref={terminalRef}>
        {lines.map(line => (
          <div key={line.id} className={`terminal-line ${line.type} ${line.isTyping ? 'typing' : ''}`}>
            <span className="timestamp">
              <Clock size={12} />
              {formatTimestamp(line.timestamp)}
            </span>
            <span className="content">{line.content}</span>
            {line.isTyping && <span className="cursor">|</span>}
          </div>
        ))}
        
        {isExecuting && (
          <div className="terminal-line info">
            <span className="timestamp">
              <Clock size={12} />
              {formatTimestamp(new Date())}
            </span>
            <span className="content">
              <Play size={12} />
              Executing command...
            </span>
          </div>
        )}
      </div>

      <div className="terminal-input">
        <span className="prompt">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a command..."
          disabled={isExecuting}
          autoFocus
        />
      </div>
    </div>
  );
};

export default TerminalPane;
