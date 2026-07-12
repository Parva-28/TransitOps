import React, { useState, useEffect } from 'react';

function load(key: string) { try { return JSON.parse(localStorage.getItem('to_' + key) || 'null'); } catch { return null; } }
function save(key: string, val: any) { localStorage.setItem('to_' + key, JSON.stringify(val)); }

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { setVehicles(load('vehicles') || []); }, []);

  const filtered = vehicles.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && v.type !== filterType) return false;
    if (filterStatus && v.status !== filterStatus) return false;
    return true;
  });

  const STATUS_PILL: Record<string,string> = { Available:'pill-available', 'On Trip':'pill-ontrip', 'In Shop':'pill-inshop', Retired:'pill-retired' };

  return (
    <>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        <div className="search-bar" style={{flex:1,maxWidth:300}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search vehicles..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{height:32,padding:'0 28px 0 10px',border:'1px solid #e2e8f0',borderRadius:999,fontSize:12,fontWeight:500,color:'#475569',background:'#fff',appearance:'none' as any,cursor:'pointer',fontFamily:"'Inter',sans-serif",outline:'none'}}>
          <option value="">Type: All</option><option>Van</option><option>Truck</option><option>Mini</option>
        </select>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{height:32,padding:'0 28px 0 10px',border:'1px solid #e2e8f0',borderRadius:999,fontSize:12,fontWeight:500,color:'#475569',background:'#fff',appearance:'none' as any,cursor:'pointer',fontFamily:"'Inter',sans-serif",outline:'none'}}>
          <option value="">Status: All</option><option>Available</option><option>On Trip</option><option>In Shop</option><option>Retired</option>
        </select>
        <div style={{flex:1}}></div>
        <button className="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Vehicle
        </button>
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr>
            <th>Vehicle</th><th>Reg. No.</th><th>Type</th><th>Capacity</th><th>Odometer</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(v => (
              <tr key={v.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:34,height:34,borderRadius:8,background:'#f1f5f9',display:'flex',alignItems:'center',justifyContent:'center'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg></div><div><div style={{fontSize:13,fontWeight:600,color:'#0f172a'}}>{v.name}</div><div style={{fontSize:11,color:'#94a3b8'}}>{v.model}</div></div></div></td>
                <td><span className="mono-id">{v.id}</span></td>
                <td>{v.type}</td>
                <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:'#0f172a'}}>{v.capacity?.toLocaleString()} kg</td>
                <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'#94a3b8'}}>{v.odo?.toLocaleString()} km</td>
                <td><span className={`pill ${STATUS_PILL[v.status]||''}`}>{v.status}</span></td>
                <td><button className="btn btn-ghost btn-sm">⋯</button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'#94a3b8'}}>No vehicles found</td></tr>}
          </tbody>
        </table>
        <div style={{padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #f1f5f9'}}>
          <span style={{fontSize:11,color:'#94a3b8',fontWeight:500}}>Showing {filtered.length} of {vehicles.length} vehicles</span>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const csv = [['Name','RegNo','Type','Capacity','Odometer','Status'].join(','), ...filtered.map(v => [v.name,v.id,v.type,v.capacity,v.odo,v.status].join(','))].join('\n');
            const a = document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv); a.download='vehicles.csv'; a.click();
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export
          </button>
        </div>
      </div>
    </>
  );
}
