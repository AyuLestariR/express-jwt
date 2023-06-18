import db from '#helper/db.mjs';

import { roleData } from './data/auth/roles.mjs';
import { employeeData } from './data/auth/employees.mjs';

import m$role from '#module/dashboard/role.m.mjs';
import m$employee from '#module/dashboard/employee.m.mjs';

async function main() {
  console.log(`Start seeding ...`);
  const createdData = {
    role: [],
    employee: [],
  };
  for (const r of roleData) {
    console.log(r);
    const { data } = await m$role.add({ ...r });
    createdData.role.push(data.nama);
  }
  for (const u of employeeData) {
    const { data } = await m$employee.add({ ...u });
    createdData.employee.push(data.nama);
  }
  console.log(createdData);
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
