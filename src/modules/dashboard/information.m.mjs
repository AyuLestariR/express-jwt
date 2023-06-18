import db from '#helper/db.mjs';
import config from '#config/app.config.json' assert { type: 'json' };

// import { object, datetime, float, string} from 'yup';

// const schema = object({
//   tanggal: datetime().label('Tanggal').required(),
//   waktu: datetime().label('Waktu').required(),
//   gps: float().label('GPS').required(),
//   jarak: float().label('Jarak').required(),
//   foto: string().label('Foto').required(),
// });

class informations {
    list = async (query = {}) => {
      try {
        const { id, nama, inquiry, presence } = query;
        const informations = await db.information.findMany({
          where: {
            presence: {
              employeeid: presence,
              tanggal :presence,
              waktu:presence,
              gps:presence,
              jarak:presence,
              foto:presence,
              status:presence,
              presensi:presence
            },
          },
        });
        return {
          status: true,
          data: informations?.map(
            ({ id }) => ({
              id,
            })
          ),
        };
      } catch (error) {
        if (config.debug) console.error(`list information module error`, error);
        return {
          status: false,
          error,
        };
      }
    };
    detail = async (params = {}) => {
      try {
        const { id } = params;
        const detail = await db.information.findUniqueOrThrow({
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
        if (config.debug) console.error(`detail information module error`, error);
        return {
          status: false,
          error,
        };
      }
    };
   
  }
  
  export default new informations();