import React from 'react';

export default function Dashboard() {
  return (
    <>
      {/* Alert Banner */}
      <div className="alert-banner alert-amber" id="alert-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span><strong>3 driver licenses expire within 7 days.</strong> Review compliance before next dispatch.</span>
        <a href="/drivers" className="alert-link">Review <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
        <button onClick={() => { const el = document.getElementById('alert-banner'); if(el) el.style.display = 'none'; }} style={{background:'none',border:'none',cursor:'pointer',color:'#b45309',marginLeft:'auto',padding:'0 4px',fontSize:16}}>✕</button>
      </div>

      {/* KPI Grid */}
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr',gap:16,marginBottom:24}}>
        <div className="kpi-card">
          <div className="kpi-label">Fleet Utilization</div>
          <div className="kpi-value">78.4<span style={{fontSize:16,color:'#94a3b8',fontWeight:600}}>%</span></div>
          <div className="kpi-trend trend-up">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            +4.2% from last week
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Trips</div>
          <div className="kpi-value">18</div>
          <div className="kpi-trend">6 dispatched · 4 en-route</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Available Drivers</div>
          <div className="kpi-value">12</div>
          <div className="kpi-trend">of 24 total drivers</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">In Maintenance</div>
          <div className="kpi-value" style={{color:'#dc2626'}}>3</div>
          <div className="kpi-trend trend-down">1 critical repair</div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Trips</div>
          <div style={{marginLeft:'auto',display:'flex',gap:8}}>
            <button className="btn btn-ghost btn-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M10 18h4"/></svg>Filter
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead><tr>
            <th>Trip ID</th><th>Route</th><th>Vehicle</th><th>Driver</th><th>Status</th><th>Cargo</th>
          </tr></thead>
          <tbody>
            <tr>
              <td><span className="mono-id">TRP-2041</span></td>
              <td><div style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#525252',fontWeight:500}}><span style={{fontWeight:600,color:'#0f172a'}}>Warehouse A</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg><span>Downtown Hub</span></div></td>
              <td><span style={{fontSize:12,color:'#0f172a',fontWeight:600}}>Van-05</span> <span style={{fontSize:11,color:'#94a3b8'}}>· Ford Transit</span></td>
              <td><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:22,height:22,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,background:'#dbeafe',color:'#1e40af'}}>AJ</div><span style={{fontSize:12,color:'#475569',fontWeight:500}}>Alex Johnson</span></div></td>
              <td><span className="pill pill-dispatched">Dispatched</span></td>
              <td><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:'#111'}}>450 kg</span></td>
            </tr>
            <tr>
              <td><span className="mono-id">TRP-2040</span></td>
              <td><div style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#525252',fontWeight:500}}><span style={{fontWeight:600,color:'#0f172a'}}>Port Terminal</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg><span>North Depot</span></div></td>
              <td><span style={{fontSize:12,color:'#0f172a',fontWeight:600}}>Truck-12</span> <span style={{fontSize:11,color:'#94a3b8'}}>· Volvo FH</span></td>
              <td><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:22,height:22,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:800,background:'#fce7f3',color:'#be185d'}}>MC</div><span style={{fontSize:12,color:'#475569',fontWeight:500}}>Maria Chen</span></div></td>
              <td><span className="pill pill-completed">Completed</span></td>
              <td><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:'#111'}}>1,200 kg</span></td>
            </tr>
          </tbody>
        </table>
        <div style={{padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #f1f5f9'}}>
          <span style={{fontSize:11,color:'#94a3b8',fontWeight:500}}>Showing 2 of 156 trips</span>
          <a href="/trips" style={{fontSize:12,color:'#0d9488',fontWeight:600,textDecoration:'none'}}>View all trips →</a>
        </div>
      </div>
    </>
  );
}
