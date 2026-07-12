import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [showAlert, setShowAlert] = useState(true);

  const { data: kpis, isLoading } = useQuery({
    queryKey: ['dashboard_kpis'],
    queryFn: () => api<any>('/dashboard/kpis')
  });

  if (isLoading || !kpis) {
    return <div style={{padding: 40, color: '#8a8a9a', fontSize: 13}}>Loading dashboard...</div>;
  }

  const { 
    activeVehicles, availableVehicles, inMaintenance, activeTrips, pendingTrips, 
    driversOnDuty, fleetUtilizationPct, fleetActivity, vehicleStatusBreakdown 
  } = kpis;

  const totalVehicles = activeVehicles + availableVehicles + inMaintenance + vehicleStatusBreakdown.RETIRED;

  const PIE_COLORS = {
    AVAILABLE: '#2d9f6f',
    ON_TRIP: '#e8a820',
    IN_SHOP: '#d94f4f',
    RETIRED: '#8a8a9a'
  };

  const pieData = [
    { name: 'Available', value: vehicleStatusBreakdown.AVAILABLE, color: PIE_COLORS.AVAILABLE },
    { name: 'On Trip', value: vehicleStatusBreakdown.ON_TRIP, color: PIE_COLORS.ON_TRIP },
    { name: 'In Shop', value: vehicleStatusBreakdown.IN_SHOP, color: PIE_COLORS.IN_SHOP },
    { name: 'Retired', value: vehicleStatusBreakdown.RETIRED, color: PIE_COLORS.RETIRED },
  ];

  return (
    <>
      {/* Alert Banner */}
      {showAlert && (
      <div className="alert-banner alert-amber">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span><strong>3 driver licenses expire within 7 days.</strong> Review compliance before next dispatch.</span>
        <a href="/drivers" className="alert-link">Review <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
        <button onClick={() => setShowAlert(false)} style={{background:'none',border:'none',cursor:'pointer',color:'#b45309',marginLeft:'auto',padding:'0 4px',fontSize:16}}>✕</button>
      </div>
      )}

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div>
              <div className="kpi-label">Fleet Utilization</div>
              <div className="kpi-value">{fleetUtilizationPct}<span style={{fontSize:16,color:'#8a8a9a',fontWeight:600}}>%</span></div>
            </div>
            <svg width="80" height="36" viewBox="0 0 80 36"><path d="M0,32 L12,26 L24,28 L36,18 L48,20 L60,10 L72,6 L80,2" fill="none" stroke="#e8a820" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M0,32 L12,26 L24,28 L36,18 L48,20 L60,10 L72,6 L80,2 L80,36 L0,36 Z" fill="url(#sparkGrad)" opacity="0.12"/><defs><linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8a820"/><stop offset="100%" stopColor="#e8a820" stopOpacity="0"/></linearGradient></defs></svg>
          </div>
          <div className="kpi-trend">
            <span style={{display:'flex',alignItems:'center',gap:3,color:'#2d9f6f',fontSize:11,fontWeight:700,background:'#e8f8f0',padding:'2px 7px',borderRadius:6,fontFamily:"'JetBrains Mono',monospace"}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>+2.1%
            </span>
            <span className="kpi-trend" style={{marginTop:0}}>vs last week</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Vehicles</div>
          <div className="kpi-value">{activeVehicles}<span style={{fontSize:14,color:'#8a8a9a',fontWeight:500,fontFamily:"'Inter',sans-serif",marginLeft:4}}>/ {totalVehicles}</span></div>
          <div style={{marginTop:14,height:4,background:'rgba(0,0,0,0.04)',borderRadius:2,overflow:'hidden'}}><div style={{width:`${fleetUtilizationPct}%`,height:'100%',background:'linear-gradient(90deg,#e8a820,#f5c542)',borderRadius:2}}></div></div>
          <div style={{marginTop:6,fontSize:11,color:'#8a8a9a',fontWeight:500}}>{fleetUtilizationPct}% of fleet active</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Active Trips</div>
          <div className="kpi-value">{activeTrips}</div>
          <div style={{marginTop:14,display:'flex',alignItems:'center',gap:5}}>
            <span style={{display:'flex',alignItems:'center',gap:3,color:'#2d9f6f',fontSize:11,fontWeight:700}}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>{Math.floor(activeTrips/3) || 1} new today
            </span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Drivers On Duty</div>
          <div className="kpi-value">{driversOnDuty}</div>
          <div style={{marginTop:14,fontSize:11,color:'#8a8a9a',fontWeight:500}}>total assigned on active trips</div>
        </div>
      </div>

      <div className="main-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="card-title">Fleet Activity</div>
              <div style={{fontSize:11,color:'#8a8a9a',marginTop:3,fontWeight:500}}>Distance covered vs. fuel consumed — last 7 days</div>
            </div>
            <div className="chart-tabs">
              <button className="chart-tab active">Week</button>
              <button className="chart-tab">Month</button>
              <button className="chart-tab">Year</button>
            </div>
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={fleetActivity} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8a8a9a', fontFamily: 'Inter' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8a8a9a', fontFamily: 'JetBrains Mono' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8a8a9a', fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: 12, fontFamily: 'Inter' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Line yAxisId="left" type="monotone" dataKey="distance" name="Distance (km)" stroke="#e8a820" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, fill: '#e8a820' }} />
                <Line yAxisId="right" type="monotone" dataKey="fuel" name="Fuel (L)" stroke="#c4b5a0" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#c4b5a0' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:'flex',gap:20,marginTop:16,paddingTop:12,borderTop:'1px solid rgba(0,0,0,0.04)'}}>
            <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:6,height:6,background:'#e8a820',borderRadius:'50%'}}></div><span style={{fontSize:11,color:'#8a8a9a',fontWeight:500}}>Distance (km)</span></div>
            <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:6,height:6,background:'#c4b5a0',borderRadius:'50%'}}></div><span style={{fontSize:11,color:'#8a8a9a',fontWeight:500}}>Fuel (L)</span></div>
          </div>
        </div>

        <div className="side-panel">
          <div className="side-card">
            <div className="card-title" style={{marginBottom:16}}>Fleet Status</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160 }}>
              <div style={{ position: 'relative', width: 140, height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={65} paddingAngle={4} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10, fontSize: 11, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }} itemStyle={{ fontWeight: 700 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', fontFamily: 'JetBrains Mono', lineHeight: 1 }}>{totalVehicles}</div>
                  <div style={{ fontSize: 9, color: '#8a8a9a', fontWeight: 600, marginTop: 4 }}>Vehicles</div>
                </div>
              </div>
            </div>
            
            <div className="donut-legend" style={{ marginTop: 12 }}>
              {pieData.map(d => (
                <div className="legend-row" key={d.name}>
                  <div className="legend-left">
                    <div className="legend-dot" style={{background: d.color}}></div>
                    <span className="legend-label">{d.name}</span>
                  </div>
                  <span className="legend-val">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
