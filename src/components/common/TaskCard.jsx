import { useState } from 'react';
import { FiClock, FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import { useTask } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';
import './TaskCard.css';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return '#DC2626';
    case 'medium':
      return '#F59E0B';
    case 'low':
      return '#22C55E';
    default:
      return '#6B7280';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const TaskCard = ({ task }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateTaskStatus } = useTask();
  const { isAdmin } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await updateTaskStatus(task.id, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const renderActionButtons = () => {
    // If admin, only show status badge
    if (isAdmin) {
      return (
        <div className="task-status-badge">
          {task.status === 'completed' ? (
            <span className="badge success">
              <FiCheckCircle /> Completed
            </span>
          ) : task.status === 'failed' ? (
            <span className="badge error">
              <FiXCircle /> Failed
            </span>
          ) : task.status === 'active' ? (
            <span className="badge info">
              <FiClock /> Active
            </span>
          ) : (
            <span className="badge new">
              <FiClock /> New
            </span>
          )}
        </div>
      );
    }

    // Employee actions
    switch (task.status) {
      case 'new':
        return (
          <div className="task-actions">
            <Button 
              variant="success" 
              size="small"
              onClick={() => handleStatusChange('active')}
              disabled={isUpdating}
              icon={<FiCheckCircle />}
            >
              Accept
            </Button>
            <Button 
              variant="error" 
              size="small"
              onClick={() => handleStatusChange('failed')}
              disabled={isUpdating}
              icon={<FiXCircle />}
            >
              Reject
            </Button>
          </div>
        );
      case 'active':
        return (
          <div className="task-actions">
            <Button 
              variant="success" 
              size="small"
              onClick={() => handleStatusChange('completed')}
              disabled={isUpdating}
              icon={<FiCheckCircle />}
            >
              Complete
            </Button>
            <Button 
              variant="error" 
              size="small"
              onClick={() => handleStatusChange('failed')}
              disabled={isUpdating}
              icon={<FiAlertTriangle />}
            >
              Mark Failed
            </Button>
          </div>
        );
      case 'completed':
      case 'failed':
        return (
          <div className="task-status-badge">
            {task.status === 'completed' ? (
              <span className="badge success">
                <FiCheckCircle /> Completed
              </span>
            ) : (
              <span className="badge error">
                <FiXCircle /> Failed
              </span>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  
  const statusIcon = {
    new: <FiClock className="status-icon new" />,
    active: <FiClock className="status-icon active" />,
    completed: <FiCheckCircle className="status-icon completed" />,
    failed: <FiXCircle className="status-icon failed" />
  };
  
  return (
    <div className={`task-card ${task.status}`}>
      <div className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }} />
      
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        {statusIcon[task.status]}
      </div>
      
      <div className={`task-content ${isExpanded ? 'expanded' : ''}`}>
        <p className="task-description">{task.description}</p>
        
        <div className="task-meta">
          <span className="task-date">
            <FiClock /> {formatDate(task.createdAt)}
          </span>
        </div>
      </div>
      
      <div className="task-footer">
        {renderActionButtons()}
        {task.description && (
          <button
            className="expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;