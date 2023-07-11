import { z } from 'zod';
import { procedure, router } from '../trpc';
import { staffRouter } from './staffRouter';
import { attendanceRouter } from './attendanceRouter';
import { settingsRouter } from './settingsRouter';
import { schedulerRouter } from './schedulerRouter';
import { rosterRouter } from './rosterRouter';
import { staffRosterRouter } from './staffRosterRouter';
import { homeRouter } from './homeRouter';

export const appRouterMain = router({
  staff: staffRouter,
  attendance: attendanceRouter,
  admin: settingsRouter,
  scheduler: schedulerRouter,
  roster:rosterRouter,
  staffRoster: staffRosterRouter,
  home:homeRouter
});

// export type definition of API
export type AppRouter = typeof appRouterMain;
