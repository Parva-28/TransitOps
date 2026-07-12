// Mocks reflecting the API contract in PLAN_BACKEND.md / plan.md
const SEED = {
  vehicles: [],
  drivers: [],
  trips: [],
  maintenance: [],
  expenses: [],
  fuelLogs: [],
};

function load(key: string) {
  try { return JSON.parse(localStorage.getItem('to_api_' + key) || 'null'); } catch { return null; }
}
function save(key: string, val: any) {
  localStorage.setItem('to_api_' + key, JSON.stringify(val));
}
function init(key: keyof typeof SEED) {
  if (!load(key)) save(key, SEED[key]);
}

['vehicles','drivers','trips','maintenance','expenses','fuelLogs'].forEach(k => init(k as keyof typeof SEED));

export async function mockResolve<T>(path: string, opts: RequestInit): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const method = opts.method || 'GET';
      const body = opts.body ? JSON.parse(opts.body as string) : {};

      if (path === '/auth/login' && method === 'POST') {
        if (body.password !== 'demo1234') return reject({ error: 'Unauthorized', message: 'Invalid password' });
        return resolve({ token: 'mock-jwt-token', user: { id: 'u1', name: 'Fleet Manager', role: 'FLEET_MANAGER' } } as T);
      }

      if (path.startsWith('/vehicles')) {
        const vehicles = load('vehicles');
        if (method === 'GET') return resolve(vehicles as T);
      }
      
      if (path.startsWith('/drivers')) {
        const drivers = load('drivers');
        if (method === 'GET') return resolve(drivers as T);
      }

      if (path === '/trips/dispatch-options' && method === 'GET') {
        const vehicles = load('vehicles').filter((v:any) => v.status === 'AVAILABLE');
        const drivers = load('drivers').filter((d:any) => d.status === 'AVAILABLE' && new Date(d.licenseExpiry) > new Date());
        return resolve({ vehicles, drivers } as T);
      }

      if (path === '/trips' && method === 'GET') {
        return resolve(load('trips') as T);
      }
      
      if (path === '/dashboard/kpis' && method === 'GET') {
        return resolve({
          activeVehicles: 5, availableVehicles: 2, inMaintenance: 1, activeTrips: 3, pendingTrips: 4, driversOnDuty: 3, fleetUtilizationPct: 87,
          vehicleStatusBreakdown: { AVAILABLE: 2, ON_TRIP: 3, IN_SHOP: 1, RETIRED: 0 },
          recentTrips: [],
          fleetActivity: [
            { day: 'Mon', distance: 240, fuel: 32 },
            { day: 'Tue', distance: 380, fuel: 48 },
            { day: 'Wed', distance: 510, fuel: 62 },
            { day: 'Thu', distance: 410, fuel: 51 },
            { day: 'Fri', distance: 680, fuel: 82 },
            { day: 'Sat', distance: 490, fuel: 58 },
            { day: 'Sun', distance: 210, fuel: 28 },
          ]
        } as T);
      }

      if (path === '/analytics/reports' && method === 'GET') {
        return resolve({
          monthlyRevenue: [
            { month: 'Jan', revenue: 85000, cost: 42000 },
            { month: 'Feb', revenue: 92000, cost: 44000 },
            { month: 'Mar', revenue: 88000, cost: 43500 },
            { month: 'Apr', revenue: 105000, cost: 48000 },
            { month: 'May', revenue: 112000, cost: 51000 },
            { month: 'Jun', revenue: 118000, cost: 53000 },
            { month: 'Jul', revenue: 125000, cost: 55000 },
          ],
          maintenanceCosts: [
            { vehicle: 'VAN-05', parts: 12000, labor: 8000 },
            { vehicle: 'TRUCK-11', parts: 24000, labor: 15000 },
            { vehicle: 'MINI-03', parts: 4500, labor: 3000 },
            { vehicle: 'VAN-09', parts: 8000, labor: 6000 },
            { vehicle: 'TRUCK-02', parts: 18000, labor: 12000 },
          ],
          driverPerformance: [
            { name: 'Alex J.', trips: 42, safetyScore: 91, hours: 160 },
            { name: 'John D.', trips: 28, safetyScore: 78, hours: 125 },
            { name: 'Priya N.', trips: 35, safetyScore: 88, hours: 140 },
            { name: 'Suresh R.', trips: 12, safetyScore: 62, hours: 85 },
            { name: 'Maria C.', trips: 48, safetyScore: 95, hours: 175 },
          ],
          vehicleUtilization: [
            { week: 'W1', van: 65, truck: 45, mini: 80 },
            { week: 'W2', van: 72, truck: 52, mini: 75 },
            { week: 'W3', van: 68, truck: 60, mini: 85 },
            { week: 'W4', van: 85, truck: 75, mini: 90 },
            { week: 'W5', van: 92, truck: 82, mini: 95 },
          ]
        } as T);
      }

      // Allow basic resolution for missing endpoints
      resolve([] as unknown as T);
    }, 300); // simulate network latency
  });
}
