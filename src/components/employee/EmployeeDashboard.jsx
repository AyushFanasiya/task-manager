import { useEffect, useState } from 'react';
import { FiInbox, FiClock, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTask } from '../../context/TaskContext';
import Header from '../common/Header';
import TaskCard from '../common/TaskCard';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const { getUserTasks, getTasksByStatus } = useTask();
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    loadTasks();
  }, [activeTab]);
  
  const loadTasks = () => {
    let filteredTasks;
    
    switch (activeTab) {
      case 'new':
      case 'active':
      case 'completed':
      case 'failed':
        filteredTasks = getTasksByStatus(activeTab);
        break;
      default:
        filteredTasks = getUserTasks();
        break;
    }
    
    // Sort tasks by creation date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setTasks(filteredTasks);
  };
  
  const refreshTasks = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadTasks();
      setIsRefreshing(false);
    }, 500);
  };
  
  const getTabCounts = () => {
    return {
      all: getUserTasks().length,
      new: getTasksByStatus('new').length,
      active: getTasksByStatus('active').length,
      completed: getTasksByStatus('completed').length,
      failed: getTasksByStatus('failed').length
    };
  };
  
  const tabCounts = getTabCounts();
  
  return (
    <div className="employee-dashboard">
      <Header />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>My Tasks</h1>
            <p>Welcome back, {currentUser.name}</p>
          </div>
          <button 
            className="refresh-button" 
            onClick={refreshTasks}
            disabled={isRefreshing}
          >
            <FiRefreshCw className={isRefreshing ? 'rotating' : ''} />
            Refresh
          </button>
        </div>
        
        <div className="task-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <FiInbox />
            All Tasks
            <span className="tab-count">{tabCounts.all}</span>
          </button>
          
          <button 
            className={`tab ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            <FiInbox />
            New Tasks
            <span className="tab-count">{tabCounts.new}</span>
          </button>
          
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <FiClock />
            Active Tasks
            <span className="tab-count">{tabCounts.active}</span>
          </button>
          
          <button 
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <FiCheckCircle />
            Completed
            <span className="tab-count">{tabCounts.completed}</span>
          </button>
          
          <button 
            className={`tab ${activeTab === 'failed' ? 'active' : ''}`}
            onClick={() => setActiveTab('failed')}
          >
            <FiXCircle />
            Failed
            <span className="tab-count">{tabCounts.failed}</span>
          </button>
        </div>
        
        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="no-tasks">
              <div className="no-tasks-icon">
                {activeTab === 'all' ? <FiInbox size={48} /> : 
                 activeTab === 'new' ? <FiInbox size={48} /> :
                 activeTab === 'active' ? <FiClock size={48} /> :
                 activeTab === 'completed' ? <FiCheckCircle size={48} /> :
                 <FiXCircle size={48} />}
              </div>
              <h3>No {activeTab !== 'all' ? activeTab : ''} tasks found</h3>
              <p>
                {activeTab === 'new' 
                  ? 'You have no new task assignments.' 
                  : activeTab === 'active'
                  ? 'You have no active tasks in progress.'
                  : activeTab === 'completed'
                  ? 'You have not completed any tasks yet.'
                  : activeTab === 'failed'
                  ? 'You have no failed tasks.'
                  : 'You have no tasks assigned to you yet.'}
              </p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;