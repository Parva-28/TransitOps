import React, { useState, useEffect } from 'react';

function load(key: string) { try { return JSON.parse(localStorage.getItem('to_' + key) || 'null'); } catch { return null; } }
function save(key: string, val: any) { localStorage.setItem('to_' + key, JSON.stringify(val)); }

export default function Maintenance() {
  const [records, setRecords] = useState<any[]>([]);
  useEffect(() => { setRecords(load('maintenance') || []); }, []);
  function reload() { setRecords([...(load('maintenance') || [])]); }

  function toggleStatus(id: string) {
    const list = load('maintenance');
    const r = list.find((x:any) => x.id === id);
    if (!r) return;
    r.status = r.status === 'In Shop' ? 'Completed' : 'In Shop';
    save('maintenance', list);
    reload();
  }

  const total = records.reduce((s:number,r:any) => s + Number(r.cost), 0);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Service Log</div>
          <div style={{marginLeft:'auto',display:'flex',gap:8}}>
            <button className="btn btn-ghost btn-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M10 18h4"/></svg>Filter
            </button>
            <button className="btn btn-ghost btn-sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Export
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead><tr><th>Vehicle</th><th>Service</th><th>Cost</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td style={{fontWeight:600,color:'#0f172a'}}>{r.vehicle}</td>
                <td style={{color:'#475569'}}>{r.service}</td>
                <td><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:'#dc2626'}}>₹{Number(r.cost).toLocaleString('en-IN')}</span></td>
                <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11.5px',color:'#94a3b8'}}>{new Date(r.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                <td><span className={`pill ${r.status==='In Shop'?'pill-inshop':'pill-completed'}`} style={{cursor:'pointer'}} onClick={()=>toggleStatus(r.id)} title="Click to toggle">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid #f1f5f9'}}>
          <span style={{fontSize:11,color:'#94a3b8',fontWeight:500}}>Showing {records.length} records</span>
          <div style={{fontSize:12,fontWeight:700,color:'#0f172a'}}>Total: <span style={{fontFamily:"'JetBrains Mono',monospace",color:'#dc2626'}}>₹{total.toLocaleString('en-IN')}</span></div>
        </div>
      </div>
    </>
  );
}
