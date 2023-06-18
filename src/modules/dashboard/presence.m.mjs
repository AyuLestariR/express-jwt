import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

import { object, date, number,string} from 'yup';

const schema = object({
  tanggal: date().label('Tanggal').required(),
  waktu: date().label('Waktu').required(),
  gps: number().label('GPS').required(),
  jarak: number().label('Jarak').required(),
  foto: string().label('Foto').required(),
});

class presences {
    list = async (query = {}) => {
      try {
        const { id, nama, inquiry, employee } = query;
        const presences = await db.presence.findMany({
          where: {
            employee: {
              nama: employee,
            },
          },
        });
        return {
          status: true,
          data: presences?.map(
            ({ id, tanggal, waktu, gps, jarak, foto, status, presensi }) => ({
              id,
              tanggal,
              waktu,
              gps,
              jarak,
              foto,
              status,
              presensi
            })
          ),
        };
      } catch (error) {
        if (config.debug) console.error(`list presence module error`, error);
        return {
          status: false,
          error,
        };
      }
    };
    detail = async (params = {}) => {
      try {
        const { id } = params;
        const detail = await db.presence.findUniqueOrThrow({
          where: {
            id: Number(id) || undefined,
          },
          include: {
            status: {
              select: {
                nama: true,
              },
            },
            presensi:{
                select: {
                    nama : true,
                }
            }
          },
        });
        return {
          status: true,
          data: detail,
        };
      } catch (error) {
        if (config.debug) console.error(`detail presence module error`, error);
        return {
          status: false,
          error,
        };
      }
    };
    add = async (body = {}) => {
      try {
        const { tanggal, waktu, gps, jarak, foto, status, presensi, employee } = body;
  
        await schema.validate(body);
  
        const presences = await db.presence.create({
          data: {
            tanggal,
            waktu,
            gps,
            jarak,
            foto,
            status,
            presensi,
            employee: {
              connectOrCreate: {
                where: {
                  nama: employee,
                },
                create: {
                  nama: employee,
                },
              },
            },
            status: {
              connectOrCreate: {
                where: {
                  nama: status,
                },
                create: {
                    nama: status,
                },
              },
            },
            presensi: {
                connectOrCreate: {
                  where: {
                    nama: presensi,
                  },
                  create: {
                      nama: presensi,
                  },
                },
              },
          },
          select: {
            nama: true,
          },
        });
        return {
          status: true,
          data: presences,
        };
      } catch (error) {
        if (config.debug) console.error(`add presence module error`, error);
        return {
          status: false,
          error,
        };
      }
    };
    update = async (body = {}) => {
      try {
        const { id, tanggal, waktu, gps, jarak, foto } = body;
  
        await schema.validate(body, { context: { update: true } });
  
        const update = await db.presence.update({
          where: {
            id: +id,
          },
          data: {
            tanggal,
            waktu,
            gps,
            jarak,
            foto,
          },
          select: {
            tanggal: true,
            waktu: true,
          },
        });
  
        return {
          status: true,
          data: update,
        };
      } catch (error) {
        if (config.debug) console.error(`update presence module error`, error);
        return {
          status: false,
          error,
        };
      }
    };
    delete = async (params = {}) => {
      try {
        const { id } = params;
        const del = await db.presence.delete({
          where: {
            id: Number(id),
          },
        });
        return {
          status: true,
          data: del,
        };
      } catch (error) {
        if (config.debug) console.error(`delete presence module error`, error);
        return {
          status: false,
          error,
        };
      }
    };
  }
  
  export default new presences();