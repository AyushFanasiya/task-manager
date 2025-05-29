// Initialize localStorage with sample data if not already set
import { initialUsers, sampleTasks } from '../data/users';

export const initializeLocalStorage = () => {
  // Initialize users if not present
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
  }
  
  // Initialize tasks if not present
  if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', JSON.stringify(sampleTasks));
  }
};

// User related functions
export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getUserById = (userId) => {
  const users = getUsers();
  return users.find(user => user.id === userId);
};

export const authenticateUser = (email, password) => {
  const users = getUsers();
  return users.find(user => user.email === email && user.password === password);
};

// Task related functions
export const getTasks = () => {
  const tasks = localStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : [];
};

export const getTasksByEmployeeId = (employeeId) => {
  const tasks = getTasks();
  return tasks.filter(task => task.assignedTo === employeeId);
};

export const getTasksByStatus = (status) => {
  const tasks = getTasks();
  return tasks.filter(task => task.status === status);
};

export const getTaskById = (taskId) => {
  const tasks = getTasks();
  return tasks.find(task => task.id === taskId);
};

export const addTask = (task) => {
  const tasks = getTasks();
  const newTask = {
    ...task,
    id: `task${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  return newTask;
};

export const updateTask = (taskId, updatedFields) => {
  const tasks = getTasks();
  const updatedTasks = tasks.map(task => 
    task.id === taskId ? { ...task, ...updatedFields } : task
  );
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  return updatedTasks.find(task => task.id === taskId);
};

export const deleteTask = (taskId) => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(filteredTasks));
};

export const getTaskCountsByEmployee = () => {
  const tasks = getTasks();
  const employees = getUsers().filter(user => user.role === 'employee');
  
  return employees.map(employee => {
    const employeeTasks = tasks.filter(task => task.assignedTo === employee.id);
    
    return {
      employee,
      counts: {
        new: employeeTasks.filter(task => task.status === 'new').length,
        active: employeeTasks.filter(task => task.status === 'active').length,
        completed: employeeTasks.filter(task => task.status === 'completed').length,
        failed: employeeTasks.filter(task => task.status === 'failed').length,
        total: employeeTasks.length
      }
    };
  });
};