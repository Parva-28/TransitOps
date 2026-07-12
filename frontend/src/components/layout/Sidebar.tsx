import { NavLink } from 'react-router-dom';

function getSession() {
  try { return JSON.parse(localStorage.getItem('to_session') || '{}'); } catch { return {}; }
}

export function Sidebar() {
  const session = getSession();
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-wrap" style={{display:'flex',alignItems:'center',gap:10}}>
          <div className="logo-mark">T</div>
          <div>
            <div className="app-name" style={{fontSize:14,fontWeight:700,color:'#f1f5f9'}}>TransitOps</div>
            <div className="app-sub" style={{fontSize:9,color:'#475569',textTransform:'uppercase',letterSpacing:'.12em',fontWeight:600}}>Operations</div>
          </div>
        </div>
      </div>
      <div className="sidebar-nav">
        <div className="nav-group-label">Command</div>
        <NavLink className={({isActive}) => `nav-item ${isActive?'active':''}`} to="/dashboard">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
          Dashboard
        </NavLink>
        <NavLink className={({isActive}) => `nav-item ${isActive?'active':''}`} to="/vehicles">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
          Fleet
        </NavLink>
        <NavLink className={({isActive}) => `nav-item ${isActive?'active':''}`} to="/drivers">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Drivers
        </NavLink>
        <NavLink className={({isActive}) => `nav-item ${isActive?'active':''}`} to="/trips">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Trips<span className="nav-badge">18</span>
        </NavLink>
        
        <div className="nav-group-label" style={{paddingTop:16}}>Operations</div>
        <NavLink className={({isActive}) => `nav-item ${isActive?'active':''}`} to="/maintenance">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          Maintenance
        </NavLink>
        <NavLink className={({isActive}) => `nav-item ${isActive?'active':''}`} to="/fuel-expenses">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Fuel &amp; Expenses
        </NavLink>
        <NavLink className={({isActive}) => `nav-item ${isActive?'active':''}`} to="/analytics">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
          Analytics
        </NavLink>
        
        <div className="nav-group-label" style={{paddingTop:16}}>System</div>
        <NavLink className={({isActive}) => `nav-item ${isActive?'active':''}`} to="/settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Settings
        </NavLink>
      </div>
      <div className="sidebar-footer">
        <div className="avatar" style={{background:'#1e3a5f'}}>{session.initials || 'RK'}</div>
        <div className="avatar-info">
          <div className="avatar-name">{session.name || 'Raven K.'}</div>
          <div className="avatar-role">{session.role || 'Dispatcher'}</div>
        </div>
      </div>
    </nav>
  );
}
