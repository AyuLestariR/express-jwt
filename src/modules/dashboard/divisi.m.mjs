import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

import { object, string} from 'yup';

const schema = object({
  kode: string().label('Kode').required(),
  nama: string().label('Nama').required(),
});

class divisii {
  list = async (query = {}) => {
    try {
      const { id, nama, inquiry } = query;
      const divisii = await db.divisi.findMany({
        where: {
          nama: {
            nama: nama,
          },
        },
      });
      return {
        status: true,
        data: divisii?.map(
          ({ id, kode, nama, createdAt, updatedAt }) => ({
            id,
            kode,
            nama,
            createdAt,
            updatedAt,
          })
        ),
      };
    } catch (error) {
      if (config.debug) console.error(`list divisi module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  detail = async (params = {}) => {
    try {
      const { id } = params;
      const detail = await db.divisi.findUniqueOrThrow({
        where: {
          id: Number(id) || undefined,
        },
      });
      return {
        status: true,
        data: detail,
      };
    } catch (error) {
      if (config.debug) console.error(`detail divisi module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  add = async (body = {}) => {
    try {
      const { kode, nama } = body;

      await schema.validate(body);

      const divisii = await db.divisi.create({
        data: {
          kode,
          nama,
        },
        select: {
          kode: true,
        },
      });
      return {
        status: true,
        data: divisii,
      };
    } catch (error) {
      if (config.debug) console.error(`add divisi module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  update = async (body = {}) => {
    try {
      const { id, kode, nama} = body;

      await schema.validate(body, { context: { update: true } });

      const update = await db.divisi.update({
        where: {
          id: +id,
        },
        data: {
          kode,
          nama,
        },
        select: {
          kode: true,
        },
      });

      return {
        status: true,
        data: update,
      };
    } catch (error) {
      if (config.debug) console.error(`update divisi module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  delete = async (params = {}) => {
    try {
      const { id } = params;
      const del = await db.divisi.delete({
        where: {
          id: Number(id),
        },
      });
      return {
        status: true,
        data: del,
      };
    } catch (error) {
      if (config.debug) console.error(`delete divisi module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new divisii();
