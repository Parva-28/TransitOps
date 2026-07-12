/**
 * TransitOps Shared State Engine
 * All pages load this. Data persists via localStorage.
 * BACKEND STUB: Replace localStorage calls with fetch() to real API endpoints.
 */

const TO = (() => {
  // ── Seed data (used only if localStorage is empty) ──────────────────────
  const SEED = {
    vehicles: [
      { id: 'GJ01AJ3463', name: 'Van-05',   model: 'Ford Transit L',   type: 'Van',   subtype: 'Standard', capacity: 500,  cost: 430000, odo: 84210,   status: 'Available' },
      { id: 'GJ01AJ3945', name: 'Truck-11', model: 'Volvo FH',         type: 'Truck', subtype: '5 Ton',    capacity: 5000, cost: 130000, odo: 340000,  status: 'On Trip'   },
      { id: 'GJ01AJ3129', name: 'Mini-05',  model: 'Tata Ace',         type: 'Mini',  subtype: '1 Ton',    capacity: 1000, cost: 69000,  odo: 40000,   status: 'In Shop'   },
      { id: 'GJ01AJ3000', name: 'Van-04',   model: 'Mahindra Supro',   type: 'Van',   subtype: 'Compact',  capacity: 750,  cost: 49000,  odo: 540000,  status: 'Retired'   },
      { id: 'GJ01AJ3001', name: 'Van-03',   model: 'Toyota HiAce',     type: 'Van',   subtype: 'Standard', capacity: 500,  cost: 510000, odo: 62000,   status: 'Available' },
      { id: 'GJ01AJ3002', name: 'Truck-01', model: 'Tata Prima',       type: 'Truck', subtype: '10 Ton',   capacity: 10000,cost: 980000, odo: 190000,  status: 'Available' },
    ],
    drivers: [
      { id: 'DRV001', name: 'Alex Johnson', initials: 'AJ', color: '#dbeafe', textColor: '#1e40af', role: 'Fleet Driver',   license: 'DL-88213-L', category: 'LMV', expiry: '10/2028', trips: 146, score: 91, status: 'Available' },
      { id: 'DRV002', name: 'Priya Nair',   initials: 'PN', color: '#fce7f3', textColor: '#be185d', role: 'Senior Driver', license: 'DL-44901-H', category: 'HGV', expiry: '08/2026', trips: 214, score: 78, status: 'On Trip'   },
      { id: 'DRV003', name: 'Parag Patel',  initials: 'PP', color: '#fef3c7', textColor: '#92400e', role: 'Fleet Driver',   license: 'DL-22341-M', category: 'MCV', expiry: '05/2026', trips: 98,  score: 62, status: 'Off Duty', licenseExpired: true },
      { id: 'DRV004', name: 'Suresh Rathod',initials: 'SR', color: '#f3f4f6', textColor: '#374151', role: 'Fleet Driver',   license: 'DL-81490-L', category: 'LMV', expiry: '11/2029', trips: 311, score: 95, status: 'Available' },
    ],
    trips: [
      { id: 'TRP-2041', source: 'Gandhinagar Depot',    dest: 'Ahmedabad Hub',      vehicle: 'Truck-05', driver: 'Alex J.',  status: 'Dispatched', cargo: 1200, distance: 45, eta: '45 min' },
      { id: 'TRP-2044', source: 'Vatva Industrial Area', dest: 'Sanand Warehouse',   vehicle: 'Truck-44', driver: null,       status: 'Draft',      cargo: 600,  distance: 28, eta: null },
      { id: 'TRP-2046', source: 'Manasa',                dest: 'Kalol Depot',        vehicle: 'Truck-12', driver: null,       status: 'Cancelled',  cargo: 900,  distance: 60, eta: null },
      { id: 'TRP-2040', source: 'Port Terminal',         dest: 'North Depot',        vehicle: 'Truck-12', driver: 'Maria C.', status: 'Completed',  cargo: 3000, distance: 82, eta: null },
      { id: 'TRP-2042', source: 'Kadi Hub',              dest: 'Mehsana Depot',      vehicle: 'Van-03',   driver: 'Priya N.', status: 'Dispatched', cargo: 450,  distance: 32, eta: '20 min' },
    ],
    maintenance: [
      { id: 'MNT001', vehicle: 'Van-05',   service: 'Oil Change',       cost: 3500,  date: '2026-07-01', status: 'In Shop'   },
      { id: 'MNT002', vehicle: 'Truck-11', service: 'Engine Repair',    cost: 15000, date: '2026-06-28', status: 'Completed' },
      { id: 'MNT003', vehicle: 'Mini-05',  service: 'Tyre Replace',     cost: 9000,  date: '2026-06-25', status: 'In Shop'   },
      { id: 'MNT004', vehicle: 'Van-03',   service: 'Brake Inspection', cost: 2800,  date: '2026-06-20', status: 'Completed' },
      { id: 'MNT005', vehicle: 'Truck-01', service: 'Full Service',     cost: 22000, date: '2026-06-15', status: 'Completed' },
    ],
    expenses: [
      { id: 'EXP001', vehicle: 'Truck-11', type: 'Fuel',    liters: 120, amount: 10800, date: '2026-07-10', receipt: 'REC-9910' },
      { id: 'EXP002', vehicle: 'Van-05',   type: 'Expense', liters: null,amount: 3200,  date: '2026-07-09', receipt: 'REC-9905' },
      { id: 'EXP003', vehicle: 'Truck-01', type: 'Fuel',    liters: 200, amount: 18000, date: '2026-07-08', receipt: 'REC-9901' },
    ],
    settings: {
      company: 'Gujarat Transport Pvt. Ltd.',
      city: 'Gandhinagar, Gujarat',
      currency: 'INR',
      licenseAlerts: true,
      capacityValidation: true,
      autoUpdateStatus: true,
      twoFactor: false,
    }
  };

  // ── Storage helpers ───────────────────────────────────────────────────────
  function load(key) {
    try { return JSON.parse(localStorage.getItem('to_' + key)); } catch { return null; }
  }
  function save(key, val) {
    localStorage.setItem('to_' + key, JSON.stringify(val));
  }
  function init(key) {
    if (!load(key)) save(key, SEED[key]);
  }

  ['vehicles','drivers','trips','maintenance','expenses','settings'].forEach(init);

  // ── Public API ───────────────────────────────────────────────────────────
  return {
    // Vehicles
    getVehicles: () => load('vehicles'),
    saveVehicles: (v) => save('vehicles', v),
    addVehicle(v) {
      const list = load('vehicles');
      list.push(v);
      save('vehicles', list);
    },
    updateVehicleStatus(name, status) {
      const list = load('vehicles');
      const v = list.find(x => x.name === name);
      if (v) v.status = status;
      save('vehicles', list);
    },

    // Drivers
    getDrivers: () => load('drivers'),
    saveDrivers: (d) => save('drivers', d),
    addDriver(d) {
      const list = load('drivers');
      list.push(d);
      save('drivers', list);
    },
    updateDriverStatus(id, status) {
      const list = load('drivers');
      const d = list.find(x => x.id === id);
      if (d) d.status = status;
      save('drivers', list);
    },

    // Trips
    getTrips: () => load('trips'),
    addTrip(t) {
      const list = load('trips');
      list.unshift(t);
      save('trips', list);
    },
    updateTripStatus(id, status) {
      const list = load('trips');
      const t = list.find(x => x.id === id);
      if (t) t.status = status;
      save('trips', list);
    },

    // Maintenance
    getMaintenance: () => load('maintenance'),
    addMaintenance(m) {
      const list = load('maintenance');
      list.unshift(m);
      save('maintenance', list);
    },

    // Expenses
    getExpenses: () => load('expenses'),
    addExpense(e) {
      const list = load('expenses');
      list.unshift(e);
      save('expenses', list);
    },

    // Settings
    getSettings: () => load('settings'),
    saveSettings: (s) => save('settings', s),

    // Session (role / user)
    getSession() { return load('session') || { role: 'Dispatcher', name: 'Raven K.', initials: 'RK' }; },
    setSession(s) { save('session', s); },

    // Draft trip (cross-page)
    getDraft: () => load('tripDraft'),
    saveDraft: (d) => save('tripDraft', d),
    clearDraft: () => localStorage.removeItem('to_tripDraft'),

    // Utility: generate ID
    genId(prefix) {
      return prefix + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    },
  };
})();

// ── Toast notification system ─────────────────────────────────────────────
function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px';
    document.body.appendChild(container);
  }
  const colors = { success: '#059669', error: '#dc2626', warn: '#d97706', info: '#0d9488' };
  const icons  = { success: '✓', error: '✕', warn: '!', info: 'i' };
  const toast  = document.createElement('div');
  toast.style.cssText = `background:#fff;border:1px solid #e2e8f0;border-left:4px solid ${colors[type]};border-radius:8px;padding:12px 16px;font-size:13px;font-weight:500;color:#0f172a;box-shadow:0 4px 16px rgba(0,0,0,.12);display:flex;align-items:center;gap:10px;min-width:260px;max-width:340px;animation:slideIn .2s ease`;
  toast.innerHTML = `<span style="width:20px;height:20px;border-radius:50%;background:${colors[type]};color:#fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${icons[type]}</span><span style="flex:1">${msg}</span>`;
  if (!document.getElementById('toast-anim')) {
    const s = document.createElement('style');
    s.id = 'toast-anim';
    s.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
    document.head.appendChild(s);
  }
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ── Modal system ──────────────────────────────────────────────────────────
function showModal({ title, body, confirmText = 'Confirm', confirmClass = 'btn btn-primary', onConfirm, cancelText = 'Cancel' }) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fadeIn .15s ease';
  if (!document.getElementById('modal-anim')) {
    const s = document.createElement('style');
    s.id = 'modal-anim';
    s.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
    document.head.appendChild(s);
  }
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:28px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.2)">
      <div style="font-size:16px;font-weight:700;color:#0f172a;margin-bottom:8px">${title}</div>
      <div style="font-size:13px;color:#64748b;line-height:1.6;margin-bottom:24px">${body}</div>
      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button id="modal-cancel" class="btn btn-ghost">${cancelText}</button>
        <button id="modal-confirm" class="${confirmClass}">${confirmText}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#modal-cancel').onclick = () => overlay.remove();
  overlay.querySelector('#modal-confirm').onclick = () => { onConfirm(); overlay.remove(); };
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

// ── CSV export helper ─────────────────────────────────────────────────────
function exportCSV(headers, rows, filename) {
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = filename;
  a.click();
  showToast('CSV exported successfully', 'success');
}
