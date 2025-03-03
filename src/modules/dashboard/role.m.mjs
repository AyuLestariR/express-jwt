import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

class _role {
  add = async (body = {}) => {
    try {
      const { nama, path } = body;

      const add = await db.role.create({
        data: {
          nama,
          access: {
            connectOrCreate: path?.map((p) => ({
              where: {
                path: p,
              },
              create: {
                path: p,
              },
            })),
          },
        },
        select: {
          nama: true,
        },
      });
      return {
        status: true,
        data: add,
      };
    } catch (error) {
      if (config.debug) console.error(`add role module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
}

export default new _role();
