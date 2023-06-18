import config from '#config/app.config.json' assert { type: 'json' };
import db from '#helper/db.mjs';
import response from '#helper/response.mjs';

import jwt from 'jsonwebtoken';

const checkPermission = async (roleId = 6, targetUrl) => {
  const pathByRoleId = await db.access.findMany({
    where: {
      roleId,
    },
    select: {
      path: true,
    },
  });
  const allowedPath = pathByRoleId?.filter(({ path }) =>
    targetUrl.startsWith(path)
  );
  return !!allowedPath.length;
};

const employeeAuth = async (req, res, next) => {
  const { headers, originalUrl } = req;
  const token = headers?.authorization?.startsWith('Bearer')
    ? headers?.authorization?.split(' ')[1]
    : null;

  if (!token) {
    response.send(res, {
      status: false,
      error: 'Not Authenticated, No Session',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);

    const isAllowed = await checkPermission(decoded.role.id, originalUrl);

    if (!isAllowed) {
      throw new Error('Not Permitted');
    }

    const employee = await db.employee.findUniqueOrThrow({
      where: {
        nik: decoded.id,
      },
      select: {
        id: true,
        nama: true,
        nik: true,
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

    req.employee = {
      ...employee,
      employeeRole: undefined,
      role: employee.employeeRole[0].role,
    };

    next();
  } catch (error) {
    if (config.debug) console.error(`employeeAuth middleware helper error`, error);
    response.send(res, {
      status: false,
      error,
    });
  }
};

export default employeeAuth;
