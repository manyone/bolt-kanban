import React, { useState, useEffect } from 'react';
import { Task, Column } from '../types';
import { Edit2, Trash2, GripVertical, Plus, Save, Upload, Copy, X } from 'lucide-react';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskColor, setNewTaskColor] = useState('#ffffff');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [saveText, setSaveText] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const addTask = () => {
    if (newTask.trim() === '') return;
    const task: Task = {
      id: Date.now().toString(),
      content: newTask,
      column: 'start',
      color: newTaskColor,
    };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    setNewTask('');
    setNewTaskColor('#ffffff');
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const moveTask = (taskId: string, newColumn: Column) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, column: newColumn } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
  };

  const updateTask = () => {
    if (editingTask) {
      const updatedTasks = tasks.map(task => 
        task.id === editingTask.id ? editingTask : task
      );
      setTasks(updatedTasks);
      setEditingTask(null);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const changeTaskColor = (taskId: string, color: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, color } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const onDrop = (e: React.DragEvent, column: Column) => {
    const taskId = e.dataTransfer.getData('taskId');
    moveTask(taskId, column);
  };

  const saveTasks = () => {
    const tasksJson = JSON.stringify(tasks);
    setSaveText(tasksJson);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(saveText).then(() => {
      alert('Tasks copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  const closeSaveText = () => {
    setSaveText('');
  };

  const loadTasks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          try {
            const loadedTasks = JSON.parse(content);
            setTasks(loadedTasks);
            localStorage.setItem('tasks', JSON.stringify(loadedTasks));
          } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Invalid file format. Please upload a valid JSON file.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const renderColumn = (column: Column) => (
    <div 
      className="bg-gray-100 p-4 rounded-lg shadow-md w-full md:w-1/3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, column)}
    >
      <h2 className="text-xl font-bold mb-4 capitalize">{column.replace('_', ' ')}</h2>
      {tasks.filter(task => task.column === column).map(task => (
        <div 
          key={task.id} 
          className="mb-2 p-2 rounded-md shadow-sm cursor-move" 
          style={{ backgroundColor: task.color }}
          draggable
          onDragStart={(e) => onDragStart(e, task.id)}
        >
          {editingTask?.id === task.id ? (
            <input
              type="text"
              value={editingTask.content}
              onChange={(e) => setEditingTask({ ...editingTask, content: e.target.value })}
              onBlur={updateTask}
              className="w-full p-1 rounded"
            />
          ) : (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <GripVertical size={16} className="mr-2 text-gray-500" />
                <span>{task.content}</span>
              </div>
              <div>
                <button onClick={() => editTask(task)} className="mr-2 text-blue-600">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteTask(task.id)} className="text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )}
          <div className="mt-2 flex justify-between items-center">
            <select
              value={task.column}
              onChange={(e) => moveTask(task.id, e.target.value as Column)}
              className="p-1 rounded text-sm"
            >
              <option value="start">Start</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <input
              type="color"
              value={task.color}
              onChange={(e) => changeTaskColor(task.id, e.target.value)}
              className="w-6 h-6 rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className="flex-grow p-2 rounded-md border"
          />
          <input
            type="color"
            value={newTaskColor}
            onChange={(e) => setNewTaskColor(e.target.value)}
            className="w-10 h-10 rounded-full"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Task
          </button>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={saveTasks}
            className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Save size={20} className="mr-2" />
            Generate Save Text
          </button>
          <label className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center cursor-pointer">
            <Upload size={20} className="mr-2" />
            Load Tasks
            <input
              type="file"
              onChange={loadTasks}
              accept=".json,text/plain"
              className="hidden"
            />
          </label>
        </div>
        {saveText && (
          <div className="mt-4 relative">
            <textarea
              value={saveText}
              readOnly
              className="w-full p-2 border rounded-md"
              rows={3}
            />
            <button
              onClick={copyToClipboard}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Copy size={20} className="mr-2" />
              Copy to Clipboard
            </button>
            <button
              onClick={closeSaveText}
              className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {renderColumn('start')}
        {renderColumn('in_progress')}
        {renderColumn('done')}
      </div>
    </div>
  );
};

export default TaskBoard;