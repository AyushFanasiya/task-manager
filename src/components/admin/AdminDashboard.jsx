import { useState, useEffect } from 'react';
import { FiUsers, FiClipboard, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { getTaskCountsByEmployee } from '../../utils/localStorage';
import TaskAssignment from './TaskAssignment';
import EmployeeTaskTable from './EmployeeTaskTable';
import Header from '../common/Header';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [employeeStats, setEmployeeStats] = useState([]);
  const [showAssignForm, setShowAssignForm] = useState(false);
  
  useEffect(() => {
    // Get task statistics by employee
    const stats = getTaskCountsByEmployee();
    setEmployeeStats(stats);
  }, []);
  
  const refreshStats = () => {
    const stats = getTaskCountsByEmployee();
    setEmployeeStats(stats);
  };
  
  const calculateTotalTasks = () => {
    return employeeStats.reduce((total, stat) => total + stat.counts.total, 0);
  };
  
  const calculateTotalByStatus = (status) => {
    return employeeStats.reduce((total, stat) => total + stat.counts[status], 0);
  };
  
  const toggleAssignForm = () => {
    setShowAssignForm(!showAssignForm);
  };
  
  return (
    <div className="admin-dashboard">
      <Header />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {currentUser.name}</p>
        </div>
        
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-content">
              <h3>{employeeStats.length}</h3>
              <p>Employees</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiClipboard />
            </div>
            <div className="stat-content">
              <h3>{calculateTotalTasks()}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div className="stat-content">
              <h3>{calculateTotalByStatus('completed')}</h3>
              <p>Completed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FiXCircle />
            </div>
            <div className="stat-content">
              <h3>{calculateTotalByStatus('failed')}</h3>
              <p>Failed</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-actions">
          <button 
            className={`assign-task-button ${showAssignForm ? 'active' : ''}`} 
            onClick={toggleAssignForm}
          >
            {showAssignForm ? 'Cancel' : 'Assign New Task'}
          </button>
        </div>
        
        {showAssignForm && (
          <TaskAssignment onTaskAssigned={() => {
            refreshStats();
            setShowAssignForm(false);
          }} />
        )}
        
        <EmployeeTaskTable 
          employeeStats={employeeStats} 
          onRefreshNeeded={refreshStats} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;