# Workout Timer

A comprehensive workout timer application built with React, TypeScript, and Vite. This application allows users to create, customize, and manage different types of timers for their workout routines.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Timer Types](#timer-types)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Multiple Timer Types**: Includes Countdown, Stopwatch, Tabata, and XY timers
- **Timer Configuration**: Create custom timers with specific durations, rounds, and work/rest intervals
- **Timer Management**: Edit, reorder, and remove timers from your workout queue
- **Descriptions**: Add descriptive text to each timer (e.g., "50 push-ups")
- **Total Workout Time**: Displays and tracks the total time for your entire workout
- **State Persistence**: 
  - Timer configurations are stored in the URL for easy sharing
  - Timer state persists through page refreshes via local storage
- **Workout History**: Track and view your completed workout sessions
- **Error Handling**: Robust error boundaries to ensure a smooth user experience
- **Responsive Design**: Works on mobile, tablet, and desktop devices

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** for navigation and URL state management
- **Styled Components** for component styling
- **TailwindCSS** for utility-first styling
- **FontAwesome** for icons
- **React Error Boundary** for error handling
- **Context API** for state management
- **Local Storage** for data persistence
- **Testing Library** for component testing

## Project Structure

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/workout-timer.git
   cd workout-timer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:5173/

## Usage

### Creating a Timer
1. Navigate to the "Add Timer" page
2. Select the type of timer you want to create (Countdown, Stopwatch, Tabata, XY)
3. Configure the timer settings (duration, rounds, work/rest periods, etc.)
4. Add a description of the exercise
5. Save the timer to add it to your workout

### Running a Workout

1. On the main timer view, you'll see all your configured timers
2. Press the play button to start your workout
3. The current timer will be highlighted, showing its progress
4. The total workout time will be displayed and count down as you progress
5. Timers will automatically transition from one to the next

### Managing Timers

- **Edit**: Click the edit button on any timer to modify its settings
- **Reorder**: Change the order of timers in your workout queue
- **Remove**: Delete timers you no longer want in your workout

### Viewing History

Navigate to the "History" page to see a log of all your completed workouts, including details about each timer used and the total duration.

## Timer Types

### Countdown Timer
A simple timer that counts down from a specified duration to zero.

### Stopwatch Timer
A timer that counts up from zero until manually stopped.

### Tabata Timer
An interval timer alternating between work and rest periods for a specified number of rounds.
### XY Timer
A timer that repeats a countdown for a specified number of rounds.
![image](https://github.com/user-attachments/assets/e24dbd62-04f5-475b-b761-2206f1ca204a)

