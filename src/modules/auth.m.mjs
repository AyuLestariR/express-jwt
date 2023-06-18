import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { object, string } from 'yup';

const schema = object({
  nama: string().label('Nama').when(('$register', ([register], schema) => (register ? schema.required() : schema))),
  nik: string().label('Nik').required(),
  divisiName: string().label('Divisi').when(('$register', ([register], schema) => (register ? schema.required() : schema))),
  jenis_kelamin: string().label('Jenis Kelamin').when(('$register', ([register], schema) => (register ? schema.required() : schema))),
  alamat: string().label('Alamat').when(('$register', ([register], schema) => (register ? schema.required() : schema))),
  no_hp: string().label('Nomor Telepon').when(('$register', ([register], schema) => (register ? schema.required() : schema))),
  email: string().label('Email').when(('$register', ([register], schema) => (register ? schema.required() : schema))),
  username: string().label('Username').when(('$register', ([register], schema) => (register ? schema.required() : schema))),
  password: string().label('Password').required(),
  foto: string().label('Foto').when(('$register', ([register], schema) => (register ? schema.required() : schema))),
  role: string().label('Role'),           
});

// extend session time to additional
// hour: k * min * second * ms
const refreshTime = 2 * 60 * 60 * 1000;

class _auth {
  register = async (body = {}) => {
    try {
      const { nama, nik, divisiName, jenis_kelamin, alamat, no_hp, email, username, password, foto, role } = body;

      await schema.validate(body, { context: { register: true } });

      const check = await db.employee.findUnique({
        where: {
          nama,
          // divisiName,
          // jenis_kelamin,
          // alamat,
          // no_hp,
          // email,
          // username,
          // foto,
        },
      });

      if (check?.nik) {
        throw new Error('User already registered');
      }

      const pw = bcrypt.hashSync(password, 10);

      let employee = {};

      if (check) {
        employee = await db.employee.update({
          where: {
            nama,
          },
          data: {
            nik,
            divisiName,
            jenis_kelamin,
            alamat,
            no_hp,
            email,
            username,
            password: pw,
            foto,
          },
          select: {
            id: true,
            name: true,
            employeeRole: {
              select: {
                roleName: true,
              },
            },
          },
        });
      } else {
        employee = await db.employee.create({
          data: {
            nama,
            nik,
            divisi,
            jenis_kelamin,
            alamat,
            no_hp,
            email,
            username,
            password: pw,
            employeeRole: {
              connectOrCreate: {
                where: {
                  employeeNik: nik,
                },
                create: {
                  role: {
                    connect: {
                      nama: role ?? 'Member',
                    },
                  },
                },
              },
            },
          },
          select: {
            id: true,
            name: true,
            employeeRole: {
              select: {
                roleName: true,
              },
            },
          },
        });
      }

      return {
        status: true,
        data: {
          nama: employee.nama,
          nik: employee.nik,
          divisiName: employee.divisiName,
          jenis_kelamin: employee.jenis_kelamin,
          alamat: employee.alamat,
          no_hp: employee.no_hp,
          email: employee.email,
          username: employee.username,
          password:employee.password ,
          foto: employee.foto,
          role: employee.employeeRole?.map(({ roleName }) => roleName),
        },
      };
    } catch (error) {
      if (config.debug) console.error(`register auth module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  login = async (body = {}) => {
    try {
      const { nik, password } = body;
      const {
        jwt: { expired, secret },
      } = config;

      await schema.validate(body);

      const check = await db.employee.findUniqueOrThrow({
        where: {
          nik,
        },
        select: {
          nama: true,
          nik: true,
          divisi: true,
          jenis_kelamin: true,
          alamat: true,
          no_hp: true,
          email: true,
          username: true,
          password: true,
          employeeRole: {
            select: {
              role: {
                select: {
                  id: true,
                  nama: true,
                },
              },
            },
          },
        },
      });

      if (!bcrypt.compareSync(password, check.password)) {
        return {
          status: false,
          code: 401,
          error: 'Wrong password',
        };
      }

      const payload = {
        id: check.nik,
        name: check.nama,
        role: check.employeeRole[0].role,
      };

      const now = Date.now();
      const token = jwt.sign(payload, secret, { expiresIn: String(expired) });
      const expiresAt = new Date(now + expired);

      return {
        status: true,
        data: { token, expiresAt },
      };
    } catch (error) {
      if (config.debug) console.error(`login auth module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  logout = async (session) => {
    try {
      await db.session.delete({
        where: {
          id: session,
        },
      });
      return {
        status: true,
        data: 'Logout success',
      };
    } catch (error) {
      if (config.debug) console.error(`logout auth module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  session = async (member = {}) => {
    try {
      return {
        status: true,
        data: {
          ...member,
          role: employee.role.nama,
          session: undefined,
        },
      };
    } catch (error) {
      if (config.debug) console.error(`session auth module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new _auth();
