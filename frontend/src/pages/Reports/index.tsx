import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, 
  AreaChart, Area, ScatterChart, Scatter, ZAxis 
} from 'recharts';

export default function Reports() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics_reports'],
    queryFn: () => api<any>('/analytics/reports')
  });

  if (isLoading || !data) {
    return <div style={{padding: 40, color: '#8a8a9a', fontSize: 13}}>Loading analytics data...</div>;
  }

  const { monthlyRevenue, maintenanceCosts, driverPerformance, vehicleUtilization } = data;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', padding: '12px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 12, marginBottom: 8, color: '#1a1a2e' }}>{label}</p>
          {payload.map((p: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, marginBottom: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }}></div>
              <span style={{ color: '#6b7280' }}>{p.name}:</span>
              <span style={{ fontWeight: 600, color: '#1a1a2e', fontFamily: 'JetBrains Mono' }}>
                {typeof p.value === 'number' && p.name.toLowerCase().includes('revenue') || p.name.toLowerCase().includes('cost') || p.name.toLowerCase().includes('parts') || p.name.toLowerCase().includes('labor')
                  ? `₹${p.value.toLocaleString('en-IN')}` 
                  : p.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: '#fff', padding: '12px', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 12, marginBottom: 8, color: '#1a1a2e' }}>{data.name}</p>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Trips: <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{data.trips}</span></div>
          <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Hours: <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{data.hours}</span></div>
          <div style={{ fontSize: 11, color: '#6b7280' }}>Safety Score: <span style={{ fontWeight: 600, color: data.safetyScore >= 80 ? '#2d9f6f' : '#d94f4f' }}>{data.safetyScore}</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <div className="kpi-card">
          <div className="kpi-label">Fleet Utilization</div>
          <div className="kpi-value">87<span style={{fontSize:16,color:'#8a8a9a',fontWeight:600}}>%</span></div>
          <div className="kpi-trend trend-up"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>+3.1% vs last month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Fuel Efficiency</div>
          <div className="kpi-value">8.4<span style={{fontSize:16,color:'#8a8a9a',fontWeight:600}}>km/L</span></div>
          <div className="kpi-trend trend-up"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>+0.6 vs last month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Operational Cost</div>
          <div className="kpi-value" style={{color:'#d94f4f'}}>₹34K</div>
          <div className="kpi-trend">Fuel + Maintenance</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">ROI (Top Vehicle)</div>
          <div className="kpi-value" style={{color:'#2d9f6f'}}>42<span style={{fontSize:16,color:'#8a8a9a',fontWeight:600}}>%</span></div>
          <div className="kpi-trend">VAN-05</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="card" style={{padding:20}}>
          <div className="card-title" style={{marginBottom:24}}>Revenue vs Operational Cost</div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyRevenue} margin={{ top: 5, right: 0, left: -10, bottom: 5 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8a8a9a', fontFamily: 'Inter' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8a8a9a', fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="revenue" name="Revenue" fill="#e8a820" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="cost" name="Cost" fill="#c4b5a0" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{padding:20}}>
          <div className="card-title" style={{marginBottom:24}}>Vehicle Maintenance Costs (Parts vs Labor)</div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={maintenanceCosts} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8a8a9a', fontFamily: 'JetBrains Mono' }} tickFormatter={(val) => `₹${val/1000}k`} />
                <YAxis dataKey="vehicle" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#4a4a5a', fontWeight: 600, fontFamily: 'Inter' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="parts" name="Parts" stackId="a" fill="#d94f4f" radius={[0, 0, 0, 0]} barSize={20} />
                <Bar dataKey="labor" name="Labor" stackId="a" fill="#f5a0a0" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{padding:20}}>
          <div className="card-title" style={{marginBottom:4}}>Driver Performance Matrix</div>
          <div style={{fontSize: 11, color: '#8a8a9a', marginBottom: 20}}>Trips completed vs Hours driven (Bubble size = Safety Score)</div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
                <XAxis type="number" dataKey="hours" name="Hours Driven" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8a8a9a' }} />
                <YAxis type="number" dataKey="trips" name="Trips Completed" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8a8a9a' }} />
                <ZAxis type="number" dataKey="safetyScore" range={[100, 800]} name="Safety Score" />
                <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Drivers" data={driverPerformance} fill="#e8a820" opacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{padding:20}}>
          <div className="card-title" style={{marginBottom:4}}>Fleet Type Utilization</div>
          <div style={{fontSize: 11, color: '#8a8a9a', marginBottom: 20}}>Maximum usage per week across vehicle categories (%)</div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={vehicleUtilization} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8a820" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e8a820" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTruck" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d94f4f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d94f4f" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMini" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d9f6f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2d9f6f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8a8a9a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8a8a9a' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area type="monotone" dataKey="mini" name="Mini Trucks" stroke="#2d9f6f" strokeWidth={2} fillOpacity={1} fill="url(#colorMini)" />
                <Area type="monotone" dataKey="van" name="Vans" stroke="#e8a820" strokeWidth={2} fillOpacity={1} fill="url(#colorVan)" />
                <Area type="monotone" dataKey="truck" name="Heavy Trucks" stroke="#d94f4f" strokeWidth={2} fillOpacity={1} fill="url(#colorTruck)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
