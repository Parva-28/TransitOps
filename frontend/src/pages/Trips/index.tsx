import React, { useState, useEffect } from 'react';

function load(key: string) { try { return JSON.parse(localStorage.getItem('to_' + key) || 'null'); } catch { return null; } }
function save(key: string, val: any) { localStorage.setItem('to_' + key, JSON.stringify(val)); }

export default function Trips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => { setTrips(load('trips') || []); }, []);
  function reload() { setTrips([...(load('trips') || [])]); }

  const filtered = filter ? trips.filter(t => t.status === filter) : trips;
  const STATUS_PILL: Record<string,string> = { Dispatched:'pill-dispatched', Draft:'pill-draft', Completed:'pill-completed', Cancelled:'pill-cancelled' };
  const counts = { Dispatched: trips.filter(t=>t.status==='Dispatched').length, Draft: trips.filter(t=>t.status==='Draft').length, Completed: trips.filter(t=>t.status==='Completed').length, Cancelled: trips.filter(t=>t.status==='Cancelled').length };

  function updateStatus(id: string, status: string) {
    const list = load('trips');
    const t = list.find((x:any) => x.id === id);
    if (t) t.status = status;
    save('trips', list);
    reload();
  }

  return (
    <>
      {/* Lifecycle bar */}
      <div style={{display:'flex',gap:0,marginBottom:24}}>
        {(['Draft','Dispatched','Completed','Cancelled'] as const).map(s => {
          const colors: Record<string,string> = { Draft:'#475569', Dispatched:'#d97706', Completed:'#059669', Cancelled:'#dc2626' };
          const bgs: Record<string,string> = { Draft:'#f1f5f9', Dispatched:'#fef3c7', Completed:'#ecfdf5', Cancelled:'#fee2e2' };
          const isActive = filter === s;
          return (
            <div key={s} onClick={() => setFilter(filter === s ? '' : s)} style={{flex:1,padding:'16px 20px',background:isActive?bgs[s]:'#fff',border:'1px solid '+(isActive?colors[s]:'#e2e8f0'),borderRadius:s==='Draft'?'10px 0 0 10px':s==='Cancelled'?'0 10px 10px 0':'0',cursor:'pointer',textAlign:'center',transition:'all .15s'}}>
              <div style={{fontSize:22,fontWeight:700,color:colors[s],fontFamily:"'JetBrains Mono',monospace"}}>{(counts as any)[s]}</div>
              <div style={{fontSize:11,fontWeight:600,color:isActive?colors[s]:'#94a3b8',textTransform:'uppercase',letterSpacing:'.06em'}}>{s}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Live Trip Board</div>
          <div style={{marginLeft:'auto',display:'flex',gap:8}}>
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilter(''); reload(); }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>Refresh
            </button>
            <button className="btn btn-primary btn-sm">+ New Trip</button>
          </div>
        </div>
        <table className="data-table">
          <thead><tr>
            <th>Trip ID</th><th>Route</th><th>Vehicle</th><th>Driver</th><th>Status</th><th>Cargo</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td><span className="mono-id">{t.id}</span></td>
                <td><div style={{display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#525252',fontWeight:500}}><span style={{fontWeight:600,color:'#0f172a'}}>{t.source}</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg><span>{t.dest}</span></div></td>
                <td style={{fontSize:12,fontWeight:600,color:'#0f172a'}}>{t.vehicle}</td>
                <td style={{fontSize:12,color:'#475569',fontWeight:500}}>{t.driver || '—'}</td>
                <td><span className={`pill ${STATUS_PILL[t.status]||''}`}>{t.status}</span></td>
                <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:700,color:'#111'}}>{t.cargo} kg</td>
                <td><div style={{display:'flex',gap:6}}>
                  {t.status==='Draft' && <button className="btn btn-primary btn-sm" onClick={()=>updateStatus(t.id,'Dispatched')}>Dispatch</button>}
                  {t.status==='Dispatched' && <><button className="btn btn-ghost btn-sm" onClick={()=>updateStatus(t.id,'Completed')}>Complete</button><button className="btn btn-ghost btn-sm" onClick={()=>updateStatus(t.id,'Cancelled')}>Cancel</button></>}
                </div></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'#94a3b8'}}>No trips found</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
