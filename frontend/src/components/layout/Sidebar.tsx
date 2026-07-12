import { NavLink } from 'react-router-dom';

function getSession() {
  try { return JSON.parse(localStorage.getItem('to_session') || '{}'); } catch { return {}; }
}

export function Sidebar() {
  const session = getSession();
  return (
    <nav className="topnav">
      <div className="topnav-logo">
        <div className="logo-mark">T</div>
        <div className="app-name">TransitOps</div>
      </div>
      <div className="topnav-links">
        <NavLink className={({isActive}) => `nav-link ${isActive?'active':''}`} to="/dashboard">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
          Dashboard
        </NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive?'active':''}`} to="/vehicles">
          Fleet
        </NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive?'active':''}`} to="/drivers">
          Drivers
        </NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive?'active':''}`} to="/trips">
          Trips
        </NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive?'active':''}`} to="/maintenance">
          Maintenance
        </NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive?'active':''}`} to="/fuel-expenses">
          Expenses
        </NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive?'active':''}`} to="/analytics">
          Analytics
        </NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive?'active':''}`} to="/settings">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          Settings
        </NavLink>
      </div>
      <div className="topnav-right">
        <div className="topnav-avatar">{session.initials || 'RK'}</div>
      </div>
    </nav>
  );
}
