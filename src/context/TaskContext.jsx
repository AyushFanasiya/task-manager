import { createContext, useState, useEffect, useContext } from 'react';
import { getTasks, addTask, updateTask, deleteTask } from '../utils/localStorage';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Load tasks from localStorage
  useEffect(() => {
    const loadTasks = () => {
      const loadedTasks = getTasks();
      setTasks(loadedTasks);
      setLoading(false);
    };
    
    loadTasks();
  }, []);

  // Get tasks for the current user if they're an employee
  const getUserTasks = () => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'employee') {
      return tasks.filter(task => task.assignedTo === currentUser.id);
    }
    
    return tasks; // Return all tasks for admin
  };

  // Create a new task
  const createTask = (taskData) => {
    const newTask = addTask(taskData);
    setTasks([...tasks, newTask]);
    return newTask;
  };

  // Update a task
  const updateTaskStatus = (taskId, newStatus) => {
    const updatedTask = updateTask(taskId, { status: newStatus });
    
    setTasks(tasks.map(task => 
      task.id === taskId ? updatedTask : task
    ));
    
    return updatedTask;
  };

  // Remove a task
  const removeTask = (taskId) => {
    deleteTask(taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return getUserTasks().filter(task => task.status === status);
  };

  const value = {
    tasks,
    getUserTasks,
    createTask,
    updateTaskStatus,
    removeTask,
    getTasksByStatus,
    loading
  };

  return (
    <TaskContext.Provider value={value}>
      {!loading && children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  return useContext(TaskContext);
};

export default TaskContext;