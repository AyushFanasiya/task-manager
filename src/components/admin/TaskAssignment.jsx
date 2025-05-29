import { useState } from 'react';
import { getUsers } from '../../utils/localStorage';
import { useTask } from '../../context/TaskContext';
import Button from '../common/Button';
import './TaskAssignment.css';

const TaskAssignment = ({ onTaskAssigned }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createTask } = useTask();
  const employees = getUsers().filter(user => user.role === 'employee');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!assignedTo) {
      setError('Please select an employee');
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    
    try {
      const newTask = {
        title,
        description,
        assignedTo,
        priority,
        status: 'new'
      };
      
      await createTask(newTask);
      
      // Reset form
      setTitle('');
      setDescription('');
      setAssignedTo('');
      setPriority('medium');
      
      // Notify parent component
      if (onTaskAssigned) {
        onTaskAssigned();
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="task-assignment">
      <h2>Assign New Task</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            rows={3}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To *</label>
            <select
              id="assignedTo"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Assigning...' : 'Assign Task'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskAssignment;