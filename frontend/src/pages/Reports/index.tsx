import React from 'react';

export default function Reports() {
  return (
    <>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:24}}>
        <div className="kpi-card">
          <div className="kpi-label">Fleet Utilization</div>
          <div className="kpi-value">87<span style={{fontSize:16,color:'#94a3b8',fontWeight:600}}>%</span></div>
          <div className="kpi-trend trend-up"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>+3.1% vs last month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Fuel Efficiency</div>
          <div className="kpi-value">8.4<span style={{fontSize:16,color:'#94a3b8',fontWeight:600}}>km/L</span></div>
          <div className="kpi-trend trend-up"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>+0.6 vs last month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Operational Cost</div>
          <div className="kpi-value" style={{color:'#dc2626'}}>₹34K</div>
          <div className="kpi-trend">Fuel + Maintenance</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">ROI (Top Vehicle)</div>
          <div className="kpi-value" style={{color:'#059669'}}>42<span style={{fontSize:16,color:'#94a3b8',fontWeight:600}}>%</span></div>
          <div className="kpi-trend">VAN-05</div>
        </div>
      </div>
      <div className="card" style={{padding:20}}>
        <div className="card-title" style={{marginBottom:16}}>Monthly Revenue</div>
        <div style={{display:'flex',gap:8,alignItems:'flex-end',height:160}}>
          {[{m:'Jan',v:8},{m:'Feb',v:10},{m:'Mar',v:7},{m:'Apr',v:12},{m:'May',v:9},{m:'Jun',v:11},{m:'Jul',v:14}].map(d => (
            <div key={d.m} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <div style={{fontSize:10,fontWeight:600,color:'#0f172a',fontFamily:"'JetBrains Mono',monospace"}}>₹{d.v}K</div>
              <div style={{width:'100%',height:d.v*10,background:'linear-gradient(135deg,#0f766e,#14b8a6)',borderRadius:4,transition:'height .3s'}}></div>
              <div style={{fontSize:10,color:'#94a3b8',fontWeight:500}}>{d.m}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
