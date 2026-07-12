export const SEED = {
  vehicles: [],
  drivers: [],
  trips: [],
  maintenance: [],
  expenses: []
};

export function initMockData() {
  function load(key: string) {
    try { return JSON.parse(localStorage.getItem('to_' + key) || 'null'); } catch { return null; }
  }
  function save(key: string, val: any) {
    localStorage.setItem('to_' + key, JSON.stringify(val));
  }

  // Clear old AI dummy data if it exists
  const oldVehicles = load('vehicles');
  if (oldVehicles && oldVehicles.length > 0 && oldVehicles[0].id === 'GJ01AJ3463') {
    ['vehicles','drivers','trips','maintenance','expenses'].forEach(k => save(k, []));
  }

  ['vehicles','drivers','trips','maintenance','expenses'].forEach((key) => {
    if (!load(key)) save(key, (SEED as any)[key]);
  });
}
