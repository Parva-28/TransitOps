import React, { useState, useEffect } from 'react';

function load(key: string) { try { return JSON.parse(localStorage.getItem('to_' + key) || 'null'); } catch { return null; } }

export default function FuelExpense() {
  const [expenses, setExpenses] = useState<any[]>([]);
  useEffect(() => { setExpenses(load('expenses') || []); }, []);

  const fuel = expenses.filter(e => e.type === 'Fuel');
  const other = expenses.filter(e => e.type === 'Expense');
  const totalFuel = fuel.reduce((s:number,e:any)=>s+Number(e.amount),0);
  const totalOther = other.reduce((s:number,e:any)=>s+Number(e.amount),0);

  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:24}}>
        <div className="card">
          <div className="card-header"><div className="card-title">Fuel Logs</div></div>
          <table className="data-table">
            <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Cost</th></tr></thead>
            <tbody>
              {fuel.length ? fuel.map(e => (
                <tr key={e.id}>
                  <td style={{fontWeight:600,color:'#0f172a'}}>{e.vehicle}</td>
                  <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'11.5px',color:'#94a3b8'}}>{new Date(e.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                  <td>{e.liters || '—'} L</td>
                  <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:'#dc2626'}}>₹{Number(e.amount).toLocaleString('en-IN')}</td>
                </tr>
              )) : <tr><td colSpan={4} style={{textAlign:'center',padding:24,color:'#94a3b8'}}>No fuel records</td></tr>}
            </tbody>
          </table>
          <div style={{padding:'12px 20px',borderTop:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:11,color:'#94a3b8'}}>{fuel.length} entries</span>
            <span style={{fontSize:12,fontWeight:700,color:'#0f172a',fontFamily:"'JetBrains Mono',monospace"}}>₹{totalFuel.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Other Expenses</div></div>
          <table className="data-table">
            <thead><tr><th>Receipt</th><th>Vehicle</th><th>Amount</th></tr></thead>
            <tbody>
              {other.length ? other.map(e => (
                <tr key={e.id}>
                  <td><span className="mono-id">{e.receipt||'—'}</span></td>
                  <td style={{fontWeight:600,color:'#0f172a'}}>{e.vehicle}</td>
                  <td style={{fontFamily:"'JetBrains Mono',monospace",fontWeight:600,color:'#dc2626'}}>₹{Number(e.amount).toLocaleString('en-IN')}</td>
                </tr>
              )) : <tr><td colSpan={3} style={{textAlign:'center',padding:24,color:'#94a3b8'}}>No expense records</td></tr>}
            </tbody>
          </table>
          <div style={{padding:'12px 20px',borderTop:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between'}}>
            <span style={{fontSize:11,color:'#94a3b8'}}>{other.length} entries</span>
            <span style={{fontSize:12,fontWeight:700,color:'#0f172a',fontFamily:"'JetBrains Mono',monospace"}}>₹{totalOther.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
      <div className="kpi-card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div><div className="kpi-label">Total Operational Cost</div></div>
        <div className="kpi-value" style={{color:'#dc2626'}}>₹{(totalFuel+totalOther).toLocaleString('en-IN')}</div>
      </div>
    </>
  );
}
