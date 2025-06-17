// SimulateIOS.js
const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to check if Xcode is installed
function checkXcodeInstalled() {
  try {
    execSync('xcode-select -p', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Function to create a simulator device if none exists
function createSimulatorDevice() {
  console.log('No iOS simulator devices found. Attempting to create one...');

  try {
    // Get available runtimes
    const runtimesOutput = execSync('xcrun simctl list runtimes available -j').toString();
    const runtimes = JSON.parse(runtimesOutput).runtimes;

    if (runtimes.length === 0) {
      console.error('No iOS runtimes available. Please open Xcode and install iOS simulator runtimes.');
      return null;
    }

    // Sort runtimes by version to get the latest one
    runtimes.sort((a, b) => {
      const versionA = parseInt(a.version.split('.')[0], 10) || 0;
      const versionB = parseInt(b.version.split('.')[0], 10) || 0;
      return versionB - versionA;
    });

    const latestRuntime = runtimes[0];
    console.log(`Using runtime: ${latestRuntime.name}`);

    // Create a new iPhone device with the latest runtime
    const deviceName = `iPhone-Simulator-${Date.now()}`;
    const deviceType = 'iPhone 14'; // A relatively modern iPhone model

    console.log(`Creating simulator device: ${deviceName} (${deviceType})`);
    const output = execSync(`xcrun simctl create "${deviceName}" "${deviceType}" ${latestRuntime.identifier}`).toString().trim();

    console.log(`Successfully created simulator device with ID: ${output}`);
    return output;
  } catch (error) {
    console.error('Error creating simulator device:', error.message);
    return null;
  }
}

// Function to start the iOS simulator
function startIOSSimulator() {
  console.log('Starting iOS Simulator...');

  try {
    // Get list of available simulators
    const availableDevices = execSync('xcrun simctl list devices available -j').toString();
    const deviceList = JSON.parse(availableDevices).devices;

    let simulatorId = null;
    // Look for an iPhone simulator (prefer newer models)
    Object.keys(deviceList).forEach(runtime => {
      deviceList[runtime].forEach(device => {
        if (device.name.includes('iPhone') && device.isAvailable && !simulatorId) {
          simulatorId = device.udid;
          console.log(`Found simulator: ${device.name}`);
        }
      });
    });

    if (!simulatorId) {
      console.log('No available iPhone simulator found. Attempting to create one...');
      simulatorId = createSimulatorDevice();

      if (!simulatorId) {
        console.error('Failed to create or find a simulator. Please try manually:');
        console.error('1. Open Xcode');
        console.error('2. Go to Xcode > Open Developer Tool > Simulator');
        console.error('3. In Simulator, go to File > Open Simulator > iOS > [choose a device]');
        console.error('4. Then run "npx expo start --ios" in your terminal');
        return false;
      }
    }

    // Boot the simulator if it's not already running
    console.log('Booting simulator...');
    try {
      execSync(`xcrun simctl boot ${simulatorId}`);
    } catch (error) {
      console.log('Simulator may already be booted, continuing...');
    }

    // Open the simulator
    console.log('Opening Simulator app...');
    execSync('open -a Simulator');

    // Wait for simulator to fully start
    console.log('Waiting for simulator to start up (15 seconds)...');
    execSync('sleep 15');

    // Start Expo for iOS
    console.log('Starting Expo on iOS simulator...');
    spawnSync('npx', ['expo', 'start', '--ios'], {
      stdio: 'inherit',
      shell: true
    });

    return true;
  } catch (error) {
    console.error('Error starting iOS simulator:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🎮 Subway Runner iOS Simulator Launcher 🎮');
  console.log('----------------------------------------');

  if (!checkXcodeInstalled()) {
    console.error('❌ Error: Xcode is not installed. Please install Xcode from the App Store.');
    process.exit(1);
  }

  // Check if we're in the right directory
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ Error: Please run this script from the subway-runner project directory.');
    process.exit(1);
  }

  // Start the simulator
  console.log('Starting iOS Simulator for Subway Runner game...');
  const success = startIOSSimulator();

  if (!success) {
    console.log('\n❌ Failed to start simulator automatically. Alternative steps:');
    console.log('1. Open Xcode');
    console.log('2. Go to Xcode menu > Preferences > Components');
    console.log('3. Download and install a simulator');
    console.log('4. Open the simulator: Xcode > Open Developer Tool > Simulator');
    console.log('5. Once simulator is open, return to terminal and run: npx expo start --ios');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('An error occurred:', err);
  process.exit(1);
});
