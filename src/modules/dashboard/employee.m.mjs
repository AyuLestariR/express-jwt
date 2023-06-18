import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

class _employee {
  list = async (query = {}) => {
    try {
      const { detail, roleName } = query;
      const employees = await db.employee.findMany({
        where: {
          employeeRole: {
            every: {
              OR: roleName?.split(',')?.map((nama) => ({
                roleName: {
                  equals: nama,
                },
              })),
            },
          },
        },
        select: {
          id: true,
          nama: true,
          nik: true,
          divisi: true,
          employeeRole: {
            select: {
              roleName: true,
            },
          },
        },
      });
      return {
        status: true,
        data: employees?.map(({ id, nama, employeeRole: [{ roleName }] }) => ({
          id,
          nama,
          role: roleName,
        })),
      };
    } catch (error) {
      if (config.debug) console.error(`list employee module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  detail = async (params = {}) => {
    try {
      const { id } = params;
      const me = await db.employee.findUniqueOrThrow({
        where: {
          id: Number(id) || undefined,
        },
        select: {
          name: true,
          email: true,
        },
      });
      return {
        status: true,
        data: {
          name: me.name,
          email: me.email,
          bio: me.profile.bio,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`detail employee module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  add = async (body = {}) => {
    try {
      const { nama, role } = body;
      const { employeeRole: [{ roleName }], ...addEmployee } = await db.employee.create({
        data: {
          nama,
          employeeRole: {
            connectOrCreate: {
              where: {
                nama: nama,
              },
              create: {
                role: {
                  connect: {
                    nama: role ?? 'Employee',
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
          nama: true,
          employeeRole: {
            select: {
              roleName: true,
            },
          },
        },
      });
      return {
        status: true,
        data: {
          ...addEmployee,
          role: roleName,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`add employee module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  update = async (params = {}, body = {}) => {
    try {
      const { id } = params;
      const { nama, email, bio } = body;
      const update = await db.employee.update({
        where: {
          id: Number(id),
        },
        data: {
          nama,
          email,
        },
        select: {
          id: true,
          nama: true,
          email: true,
        },
      });
      return {
        status: true,
        data: {
          id: update.id,
          nama: update.nama,
          email: update.email,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`update employee module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  delete = async (params = {}) => {
    try {
      const { id } = params;
      const deleteEmployee = await db.employee.delete({
        where: {
          id: Number(id),
        },
      });
      return {
        status: true,
        data: {
          name: deleteEmployee.nama,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`delete employee module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new _employee();
