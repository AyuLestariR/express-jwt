import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

// import { object, string, boolean } from 'yup';

// const schema = object({
//   title: string().label('Title').required(),
//   description: string().label('Description').required(),
//   completed: boolean().label('Completed').when(('$update', ([update], schema) => (update ? schema.required() : schema))),
// });

class histories {
  list = async (query = {}) => {
    try {
      const { id, name, inquiry, presence } = query;
      const histories = await db.history.findMany({
        where: {
          presence: {
            id: presence,
          },
        },
      });
      return {
        status: true,
        data: todo?.map(
          ({ id, createdAt, title, completed, description, categoryName }) => ({
            id,
            title,
            createdAt,
            completed,
            description,
            categoryName,
          })
        ),
      };
    } catch (error) {
      if (config.debug) console.error(`list todo module error`, error);
      return {
        status: false,
        error,
      };
    }
  };
  detail = async (params = {}) => {
    try {
      const { id } = params;
      const detail = await db.toDo.findUniqueOrThrow({
        where: {
          id: Number(id) || undefined,
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
      return {
        status: true,
        data: detail,
      };
    } catch (error) {
      if (config.debug) console.error(`detail todo module error`, error);
      return {
        status: false,
        error,
      };
    }
  };

}
export default new histories();
