import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import reportsListRoute from "./routes/reports/list/route";
import reportDetailRoute from "./routes/reports/detail/route";
import createReportRoute from "./routes/reports/create/route";
import upvoteReportRoute from "./routes/reports/upvote/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  reports: createTRPCRouter({
    list: reportsListRoute,
    detail: reportDetailRoute,
    create: createReportRoute,
    upvote: upvoteReportRoute,
  }),
});

export type AppRouter = typeof appRouter;