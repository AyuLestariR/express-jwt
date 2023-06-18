import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

import { object, date} from 'yup';

const schema = object({
  jam_masuk: date().label('Jam Masuk').required(),
  jam_keluar: date().label('Jam Keluar').required(),
});

class workingTime {
  list = async (query = {}) => {
    try {
      const { id, inquiry } = query;
      const workingTime = await db.workingtime.findMany({
        where: {
          id: {
            id: id,
          },
        },
      });
      return {
        status: true,
        data: workingTime?.map(
          ({ id, jam_masuk, jam_keluar, createdAt, updatedAt }) => ({
            id,
            jam_masuk,
            jam_keluar,
            createdAt,
            updatedAt,
          })
        ),
      };
    } catch (error) {
      if (config.debug) console.error(`list workingtime module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  detail = async (params = {}) => {
    try {
      const { id } = params;
      const detail = await db.workingtime.findUniqueOrThrow({
        where: {
          id: Number(id) || undefined,
        },
      });
      return {
        status: true,
        data: detail,
      };
    } catch (error) {
      if (config.debug) console.error(`detail workingtime module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  add = async (body = {}) => {
    try {
      const { jam_masuk, jam_keluar} = body;

      await schema.validate(body);

      const workingTime = await db.workingtime.create({
        data: {
          jam_masuk,
          jam_keluar,
        },
        select: {
          id: true,
        },
      });
      return {
        status: true,
        data: workingTime,
      };
    } catch (error) {
      if (config.debug) console.error(`add workingtime module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  update = async (body = {}) => {
    try {
      const { id, jam_masuk, jam_keluar} = body;

      await schema.validate(body, { context: { update: true } });

      const update = await db.workingtime.update({
        where: {
          id: +id,
        },
        data: {
          jam_masuk,
          jam_keluar,
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
      if (config.debug) console.error(`update workingtime module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  delete = async (params = {}) => {
    try {
      const { id } = params;
      const del = await db.workingtime.delete({
        where: {
          id: Number(id),
        },
      });
      return {
        status: true,
        data: del,
      };
    } catch (error) {
      if (config.debug) console.error(`delete workingtime module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new workingTime();
