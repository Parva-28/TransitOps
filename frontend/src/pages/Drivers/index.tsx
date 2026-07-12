import React, { useState, useEffect } from 'react';

function load(key: string) { try { return JSON.parse(localStorage.getItem('to_' + key) || 'null'); } catch { return null; } }
function save(key: string, val: any) { localStorage.setItem('to_' + key, JSON.stringify(val)); }

export default function Drivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => { setDrivers(load('drivers') || []); }, []);

  function reload() { setDrivers([...(load('drivers') || [])]); }

  const filtered = drivers.filter(d => {
    if (filterStatus && d.status !== filterStatus) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.license.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function changeStatus(id: string, status: string) {
    const list = load('drivers');
    const d = list.find((x:any) => x.id === id);
    if (d) d.status = status;
    save('drivers', list);
    reload();
  }

  const STATUS_PILL: Record<string,string> = { Available:'pill-available', 'On Trip':'pill-ontrip', 'Off Duty':'pill-inshop', Suspended:'pill-inshop' };

  return (
    <>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20,flexWrap:'wrap'}}>
        <div className="search-bar" style={{flex:1,maxWidth:300}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input type="text" placeholder="Search drivers..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{height:32,padding:'0 28px 0 10px',border:'1px solid #e2e8f0',borderRadius:999,fontSize:12,fontWeight:500,color:'#475569',background:'#fff',appearance:'none' as any,cursor:'pointer',fontFamily:"'Inter',sans-serif",outline:'none'}}>
          <option value="">Status: All</option><option>Available</option><option>On Trip</option><option>Off Duty</option><option>Suspended</option>
        </select>
      </div>

      <div className="card">
        <table className="data-table">
          <thead><tr>
            <th>Driver</th><th>License</th><th>Category</th><th>Expiry</th><th>Trips</th><th>Safety Score</th><th>Status</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(d => {
              const sc = d.score;
              const scColor = sc >= 85 ? '#059669' : sc >= 65 ? '#d97706' : '#dc2626';
              return (
                <tr key={d.id}>
                  <td><div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,background:d.color,color:d.textColor}}>{d.initials}</div><div><div style={{fontSize:13,fontWeight:600,color:'#0f172a'}}>{d.name}</div><div style={{fontSize:11,color:'#94a3b8'}}>{d.role}</div></div></div></td>
                  <td><span className="mono-id">{d.license}</span></td>
                  <td>{d.category}</td>
                  <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:'#0f172a'}}>{d.expiry}</td>
                  <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:'#0f172a'}}>{d.trips}</td>
                  <td><div style={{display:'flex',alignItems:'center',gap:8}}><div style={{width:100,height:6,background:'#e2e8f0',borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',borderRadius:3,width:`${sc}%`,background:'linear-gradient(to right,#ef4444,#f59e0b,#059669)'}}></div></div><span style={{fontSize:12,fontWeight:700,color:scColor,fontFamily:"'JetBrains Mono',monospace"}}>{sc}%</span></div></td>
                  <td><span className={`pill ${STATUS_PILL[d.status]||''}`}>{d.status}</span></td>
                  <td><div style={{display:'flex',gap:6}}>
                    {d.status === 'Available' && <><button className="btn btn-ghost btn-sm" onClick={()=>changeStatus(d.id,'On Trip')}>On Trip</button><button className="btn btn-ghost btn-sm" onClick={()=>changeStatus(d.id,'Suspended')}>Suspend</button></>}
                    {d.status === 'On Trip' && <><button className="btn btn-ghost btn-sm" onClick={()=>changeStatus(d.id,'Available')}>Available</button><button className="btn btn-ghost btn-sm" onClick={()=>changeStatus(d.id,'Suspended')}>Suspend</button></>}
                    {d.status === 'Suspended' && <button className="btn btn-ghost btn-sm" onClick={()=>changeStatus(d.id,'Available')}>Reinstate</button>}
                    {d.status === 'Off Duty' && <button className="btn btn-ghost btn-sm" onClick={()=>changeStatus(d.id,'Available')}>Activate</button>}
                  </div></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={8} style={{textAlign:'center',padding:40,color:'#94a3b8'}}>No drivers found</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
