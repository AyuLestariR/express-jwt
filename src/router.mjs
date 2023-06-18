import { AuthController } from '#controller/auth.c.mjs';
import { DivisiController } from '#controller/dashboard/divisi.c.mjs';
import { OfficeController } from '#controller/dashboard/office.c.mjs';
import { WorkingTimeController } from '#controller/dashboard/workingtime.c.mjs';
import { PresencesController } from '#controller/dashboard/presence.c.mjs';
import { InformationController } from '#controller/dashboard/information.c.mjs';
import { HistoryController } from '#controller/dashboard/history.c.mjs';


const baseRoutesArray = [['auth', AuthController]];

const apiRoutesArray = [['divisi', DivisiController], ['office', OfficeController], ['workingtime', WorkingTimeController], ['presence', PresencesController], ['information', InformationController], ['history', HistoryController]];


const routes = (app) => {
  baseRoutesArray.forEach(([url, controller]) =>
    app.use(`/${url}`, controller)
  );
  apiRoutesArray.forEach(([url, controller]) =>
    app.use(`/api/${url}`, controller)
  );
};

export { routes };
