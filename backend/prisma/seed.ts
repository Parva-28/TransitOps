// ============================================================================
// prisma/seed.ts — BA owns
// Demo data per CONTRACT.md — identical to the mockup so the demo looks live.
// Run: npx tsx prisma/seed.ts  (from backend/ directory)
// Password for all users: demo1234
// ============================================================================

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TransitOps database...');

  // ---- Clean existing data (safe for dev resets) ----
  await prisma.expense.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // ---- Users ----
  const passwordHash = await bcrypt.hash('demo1234', 10);

  const manager = await prisma.user.create({
    data: { email: 'manager@transitops.dev', passwordHash, name: 'Riya Sharma', role: 'FLEET_MANAGER' },
  });
  const driver = await prisma.user.create({
    data: { email: 'driver@transitops.dev', passwordHash, name: 'Driver User', role: 'DRIVER' },
  });
  const safety = await prisma.user.create({
    data: { email: 'safety@transitops.dev', passwordHash, name: 'Safety Officer', role: 'SAFETY_OFFICER' },
  });
  const finance = await prisma.user.create({
    data: { email: 'finance@transitops.dev', passwordHash, name: 'Finance Analyst', role: 'FINANCIAL_ANALYST' },
  });
  console.log(`✅ Users: ${manager.email}, ${driver.email}, ${safety.email}, ${finance.email}`);

  // ---- Vehicles ----
  const van05 = await prisma.vehicle.create({
    data: {
      regNo: 'VAN-05',
      name: 'Force Traveller',
      type: 'VAN',
      maxLoadKg: 500,
      odometer: 63800,
      acquisitionCost: 850000,
      region: 'South',
      status: 'AVAILABLE',
    },
  });

  const truck11 = await prisma.vehicle.create({
    data: {
      regNo: 'TRUCK-11',
      name: 'Tata Prima',
      type: 'TRUCK',
      maxLoadKg: 5000,
      odometer: 124500,
      acquisitionCost: 2200000,
      region: 'North',
      status: 'ON_TRIP',
    },
  });

  const mini03 = await prisma.vehicle.create({
    data: {
      regNo: 'MINI-03',
      name: 'Mahindra Supro',
      type: 'MINI',
      maxLoadKg: 750,
      odometer: 41200,
      acquisitionCost: 450000,
      region: 'West',
      status: 'IN_SHOP', // OPEN maintenance log will set this
    },
  });

  const van09 = await prisma.vehicle.create({
    data: {
      regNo: 'VAN-09',
      name: 'Toyota Hiace',
      type: 'VAN',
      maxLoadKg: 500,
      odometer: 28900,
      acquisitionCost: 920000,
      region: 'East',
      status: 'AVAILABLE',
    },
  });
  console.log(`✅ Vehicles: VAN-05, TRUCK-11, MINI-03, VAN-09`);

  // ---- Drivers ----
  const future = new Date('2027-06-30'); // valid license
  const pastExpiry = new Date('2024-12-31'); // for demo: if needed

  const alex = await prisma.driver.create({
    data: {
      name: 'Alex Johnson',
      licenseNo: 'DL-MH-2019-001',
      licenseCategory: 'LMV',
      licenseExpiry: future,
      contact: '+91-9876543210',
      safetyScore: 95,
      status: 'AVAILABLE',
    },
  });

  const john = await prisma.driver.create({
    data: {
      name: 'John Mathew',
      licenseNo: 'DL-DL-2018-002',
      licenseCategory: 'HMV',
      licenseExpiry: future,
      contact: '+91-9876543211',
      safetyScore: 88,
      status: 'ON_TRIP',
    },
  });

  const priya = await prisma.driver.create({
    data: {
      name: 'Priya Menon',
      licenseNo: 'DL-KL-2020-003',
      licenseCategory: 'LMV',
      licenseExpiry: future,
      contact: '+91-9876543212',
      safetyScore: 97,
      status: 'AVAILABLE',
    },
  });

  const suresh = await prisma.driver.create({
    data: {
      name: 'Suresh Patel',
      licenseNo: 'DL-GJ-2017-004',
      licenseCategory: 'HMV',
      licenseExpiry: future,
      contact: '+91-9876543213',
      safetyScore: 52,
      status: 'SUSPENDED', // key for demo: cannot be dispatched
    },
  });
  console.log(`✅ Drivers: Alex (AVAILABLE), John (ON_TRIP), Priya (AVAILABLE), Suresh (SUSPENDED)`);

  // ---- Trips TR001–TR006 ----
  const tr001 = await prisma.trip.create({
    data: {
      source: 'Bangalore Depot',
      destination: 'Chennai Warehouse',
      cargoWeightKg: 450,
      plannedDistance: 350,
      status: 'DISPATCHED',
      vehicleId: truck11.id,
      driverId: john.id,
      dispatchedAt: new Date('2026-07-11T08:00:00Z'),
    },
  });

  const tr002 = await prisma.trip.create({
    data: {
      source: 'Mumbai Hub',
      destination: 'Pune Distribution',
      cargoWeightKg: 300,
      plannedDistance: 180,
      status: 'COMPLETED',
      vehicleId: van09.id,
      driverId: priya.id,
      finalOdometer: 29080,
      fuelConsumedL: 22.5,
      revenue: 8500,
      dispatchedAt: new Date('2026-07-10T09:00:00Z'),
      completedAt: new Date('2026-07-10T13:30:00Z'),
    },
  });

  const tr003 = await prisma.trip.create({
    data: {
      source: 'Delhi Depot',
      destination: 'Gurgaon Client',
      cargoWeightKg: 200,
      plannedDistance: 45,
      status: 'COMPLETED',
      vehicleId: van05.id,
      driverId: alex.id,
      finalOdometer: 63900,
      fuelConsumedL: 8.0,
      revenue: 3200,
      dispatchedAt: new Date('2026-07-09T07:00:00Z'),
      completedAt: new Date('2026-07-09T10:00:00Z'),
    },
  });

  const tr004 = await prisma.trip.create({
    data: {
      source: 'Hyderabad Depot',
      destination: 'Secunderabad Hub',
      cargoWeightKg: 100,
      plannedDistance: 25,
      status: 'CANCELLED',
      vehicleId: van09.id,
      driverId: priya.id,
      dispatchedAt: new Date('2026-07-08T06:00:00Z'),
    },
  });

  const tr005 = await prisma.trip.create({
    data: {
      source: 'Chennai Depot',
      destination: 'Coimbatore Hub',
      cargoWeightKg: 480,
      plannedDistance: 490,
      status: 'DRAFT',
      vehicleId: van05.id,
      driverId: alex.id,
    },
  });

  const tr006 = await prisma.trip.create({
    data: {
      source: 'Kolkata Hub',
      destination: 'Bhubaneswar Depot',
      cargoWeightKg: 350,
      plannedDistance: 450,
      status: 'COMPLETED',
      vehicleId: van09.id,
      driverId: priya.id,
      finalOdometer: 29530,
      fuelConsumedL: 58.5,
      revenue: 15000,
      dispatchedAt: new Date('2026-07-07T05:00:00Z'),
      completedAt: new Date('2026-07-07T19:00:00Z'),
    },
  });
  console.log(`✅ Trips: TR001(DISPATCHED), TR002(COMPLETED), TR003(COMPLETED), TR004(CANCELLED), TR005(DRAFT), TR006(COMPLETED)`);

  // ---- Fuel Logs ----
  await prisma.fuelLog.createMany({
    data: [
      { vehicleId: van09.id, liters: 22.5, cost: 2475, odometer: 29080, date: new Date('2026-07-10T13:30:00Z') },
      { vehicleId: van05.id, liters: 8.0,  cost: 880,  odometer: 63900, date: new Date('2026-07-09T10:00:00Z') },
      { vehicleId: van09.id, liters: 58.5, cost: 6435, odometer: 29530, date: new Date('2026-07-07T19:00:00Z') },
      { vehicleId: truck11.id, liters: 95.0, cost: 10450, odometer: 124000, date: new Date('2026-07-05T12:00:00Z') },
    ],
  });
  console.log(`✅ Fuel logs: 4 entries`);

  // ---- Expenses ----
  await prisma.expense.createMany({
    data: [
      { vehicleId: truck11.id, type: 'TOLL', amount: 450, description: 'NH48 toll — Delhi to Jaipur', date: new Date('2026-07-05T08:00:00Z') },
      { vehicleId: van09.id,  type: 'TOLL', amount: 120, description: 'Expressway toll — Mumbai to Pune', date: new Date('2026-07-10T09:30:00Z') },
      { vehicleId: mini03.id, type: 'OTHER', amount: 800, description: 'Tyre puncture repair', date: new Date('2026-07-08T14:00:00Z') },
    ],
  });
  console.log(`✅ Expenses: 3 entries`);

  // ---- Maintenance Log (MINI-03 is IN_SHOP) ----
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: mini03.id,
      type: 'Oil Change',
      cost: 3500,
      status: 'OPEN',
      notes: 'Full synthetic oil change + filter replacement',
      openedAt: new Date('2026-07-11T10:00:00Z'),
    },
  });

  // A closed maintenance log for reporting
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: truck11.id,
      type: 'Tyre Replacement',
      cost: 12000,
      status: 'CLOSED',
      notes: '4 tyres replaced — front + rear',
      openedAt: new Date('2026-07-01T08:00:00Z'),
      closedAt: new Date('2026-07-02T17:00:00Z'),
    },
  });
  console.log(`✅ Maintenance: MINI-03 OPEN (IN_SHOP), TRUCK-11 CLOSED`);

  console.log('\n🎉 Seed complete! Demo credentials:');
  console.log('   manager@transitops.dev  / demo1234  (FLEET_MANAGER)');
  console.log('   driver@transitops.dev   / demo1234  (DRIVER)');
  console.log('   safety@transitops.dev   / demo1234  (SAFETY_OFFICER)');
  console.log('   finance@transitops.dev  / demo1234  (FINANCIAL_ANALYST)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
