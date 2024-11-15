import React from 'react';
import TaskBoard from './components/TaskBoard';

function App() {
  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Processor</h1>
      <TaskBoard />
    </div>
  );
}

export default App;