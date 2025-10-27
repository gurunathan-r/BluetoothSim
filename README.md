# Bluetooth Simulation Lab

An educational web application that simulates Bluetooth-era reconnaissance and attack workflows for cybersecurity training. This tool provides a safe, simulated environment to learn about Bluetooth security concepts without any real-world effects.

## ⚠️ Important Safety Notice

**This application is designed EXCLUSIVELY for educational and training purposes.** All Bluetooth interactions, commands, and results are completely simulated and have NO REAL-WORLD EFFECTS. No actual Bluetooth hardware is accessed or modified.

## 🎯 Learning Objectives

- Understand Bluetooth security vulnerabilities and attack vectors
- Learn about BlueJacking, Bluesnarfing, and MAC address spoofing concepts
- Recognize defensive measures and security best practices
- Develop awareness of wireless security risks in a safe environment

## 🚀 Features

### Core Simulation Features
- **100% Simulated Environment**: No real Bluetooth hardware interaction
- **Interactive Terminal**: Typewriter-animated command execution
- **Visual Topology**: Real-time network visualization with device animations
- **Multiple Scenarios**: Pre-built scenarios for different learning objectives
- **Custom Scenarios**: Create your own simulation environments

### Educational Content
- **Safety Disclaimers**: Prominent warnings about educational use only
- **Ethics Quiz**: Required for advanced features to ensure responsible use
- **Learning Objectives**: Clear goals for each scenario
- **Security Recommendations**: Best practices and defensive measures

### Scenarios Included
1. **BlueJacking Demonstration**: Learn about unsolicited message attacks
2. **Bluesnarfing Demonstration**: Understand unauthorized data access
3. **MAC Address Spoofing**: Explore device impersonation concepts
4. **Crowded Cafe Environment**: High-density Bluetooth simulation
5. **Office Environment**: Corporate security scenario

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Visualization**: D3.js for interactive topology canvas
- **Styling**: CSS3 with modern design patterns
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bluetooth-simulation-lab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## 🎮 Usage

### Getting Started
1. **Safety Acknowledgment**: Read and acknowledge the safety disclaimer
2. **Select Mode**: Choose between Basic and Advanced modes
3. **Ethics Quiz**: Complete the quiz for advanced features (if applicable)
4. **Choose Scenario**: Select from predefined scenarios or create custom ones
5. **Execute Commands**: Use the simulated terminal to run commands
6. **Observe Results**: Watch the topology canvas for visual feedback

### Available Commands
All commands are prefixed with `sim` and are purely simulated:

- `sim scan --range=<meters> --filter=<device-type>` - Device discovery
- `sim message --from=<attacker> --to=<target> --payload="<text>"` - BlueJacking simulation
- `sim pull-info --target=<device> --protocol=OBEX` - Bluesnarfing simulation
- `sim set-mac --device=<attacker> --mac=<new-mac>` - MAC spoofing simulation
- `sim defend --device=<target> --action=<defense-type>` - Defense activation

### Terminal Features
- **Command History**: Use ↑/↓ arrows to navigate previous commands
- **Tab Completion**: Press TAB for command suggestions
- **Help System**: Type `help` for available commands
- **Real-time Feedback**: See command execution and results

## 🔒 Security & Ethics

### Prohibited Uses
- Attempting to use simulated commands on real devices
- Using this tool to target actual Bluetooth devices
- Extracting or modifying real hardware configurations
- Any malicious or unauthorized activities

### Ethical Guidelines
- Use only for legitimate educational purposes
- Report real vulnerabilities through proper channels
- Respect privacy and security of others
- Follow responsible disclosure practices

## 🏗️ Architecture

### Core Components
- **SimulationEngine**: Core simulation logic and command processing
- **ScenarioLibrary**: Predefined educational scenarios
- **TerminalPane**: Interactive command interface
- **TopologyCanvas**: Visual network representation
- **ScenarioControls**: Scenario selection and customization
- **SafetyDisclaimer**: Educational use acknowledgment
- **EthicsQuiz**: Responsible use verification

### Data Models
- **Device**: Represents simulated Bluetooth devices
- **SimulationEvent**: Logs all simulated actions
- **Scenario**: Defines simulation parameters and learning objectives
- **CommandTemplate**: Safe command definitions

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run linting:
```bash
npm run lint
```

## 📚 Educational Resources

### For Instructors
- **Scenario Guides**: Detailed explanations for each scenario
- **Learning Objectives**: Clear goals and assessment criteria
- **Safety Protocols**: Best practices for classroom use
- **Quiz Questions**: Sample questions for student assessment

### For Students
- **Command Reference**: Complete list of simulated commands
- **Security Concepts**: Explanations of Bluetooth vulnerabilities
- **Defensive Measures**: How to protect against attacks
- **Best Practices**: Real-world security recommendations

## 🤝 Contributing

This project is designed for educational use. Contributions should:
- Maintain the educational focus
- Ensure all code is purely simulated
- Include appropriate safety disclaimers
- Follow ethical guidelines

## 📄 License

MIT License - See LICENSE file for details

## ⚠️ Disclaimer

This software is provided for educational purposes only. The authors and contributors are not responsible for any misuse of this software. Users must agree to use this tool only for legitimate educational and training purposes and not for any malicious activities.

## 🆘 Support

For questions or issues:
1. Check the documentation
2. Review the safety guidelines
3. Contact the development team for educational use inquiries

---

**Remember: This is a simulation tool. All commands and results are fake and have no real-world effects.**
