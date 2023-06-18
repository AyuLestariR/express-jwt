import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

import { object, string, number} from 'yup';

const schema = object({
  nama: string().label('Nama').required(),
  alamat: string().label('Alamat').required(),
  latitude: number().label('Latitude').required(),
  longitude: number().label('Longitude').required(),
  jarak: number().label('Jarak').required(),
});

class offices {
  list = async (query = {}) => {
    try {
      const { id, nama, alamat, latitude, longitude, jarak, inquiry } = query;
      const offices = await db.office.findMany({
        where: {
          office: {
            id:id,
            nama: nama,
            alamat:alamat,
            latitude:latitude,
            longitude:longitude,
            jarak:jarak
          },
        },
      });
      return {
        status: true,
        data: offices?.map(
          ({ id, nama, alamat, latitude, longitude, jarak, createdAt, updatedAt }) => ({
            id,
            nama,
            alamat,
            latitude,
            longitude,
            jarak,
            createdAt,
            updatedAt,
          })
        ),
      };
    } catch (error) {
      if (config.debug) console.error(`list office module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  detail = async (params = {}) => {
    try {
      const { id } = params;
      const detail = await db.office.findUniqueOrThrow({
        where: {
          id: Number(id) || undefined,
        },
      });
      return {
        status: true,
        data: detail,
      };
    } catch (error) {
      if (config.debug) console.error(`detail office module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  add = async (body = {}) => {
    try {
      const { nama, alamat, latitude, longitude, jarak} = body;

      await schema.validate(body);

      const offices = await db.office.create({
        data: {
            nama,
            alamat,
            latitude,
            longitude,
            jarak,
        },
        select: {
          id: true,
        },
      });
      return {
        status: true,
        data: offices,
      };
    } catch (error) {
      if (config.debug) console.error(`add office module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  update = async (body = {}) => {
    try {
      const { id, nama, alamat, latitude, longitude, jarak,} = body;

      await schema.validate(body, { context: { update: true } });

      const update = await db.office.update({
        where: {
          id: +id,
        },
        data: {
            nama,
            alamat,
            latitude,
            longitude,
            jarak,
        },
        select: {
          id: true,
        },
      });

      return {
        status: true,
        data: update,
      };
    } catch (error) {
      if (config.debug) console.error(`update office module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  delete = async (params = {}) => {
    try {
      const { id } = params;
      const del = await db.office.delete({
        where: {
          id: Number(id),
        },
      });
      return {
        status: true,
        data: del,
      };
    } catch (error) {
      if (config.debug) console.error(`delete office module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new offices();
