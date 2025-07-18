import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { getDueSubscriptions, generateInvoice, getOverdueInvoices, sendLatePaymentNotification, runDataRetentionJob } from "./storage";
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Automated invoice generation scheduler (runs every hour)
  setInterval(async () => {
    console.log('[Scheduler] Running automated invoice generation');
    const dueSubscriptions = await getDueSubscriptions();
    for (const sub of dueSubscriptions) {
      // TODO: Pass correct data structure for invoice generation
      await generateInvoice({ subscriptionId: sub.id, amount: sub.amount, clientId: sub.client_id, planId: sub.plan_id });
      console.log(`[Scheduler] Generated invoice for subscription ${sub.id}`);
    }
  }, 1000 * 60 * 60); // every hour

  // Late payment notification scheduler (runs every day)
  setInterval(async () => {
    console.log('[Scheduler] Running late payment notification check');
    const overdueInvoices = await getOverdueInvoices();
    for (const inv of overdueInvoices) {
      await sendLatePaymentNotification(inv.id, inv.user_id);
      console.log(`[Scheduler] Sent late payment notification for invoice ${inv.id}`);
    }
  }, 1000 * 60 * 60 * 24); // every day

  // Data retention job (runs daily)
  setInterval(async () => {
    console.log('[Scheduler] Running data retention job');
    await runDataRetentionJob();
  }, 1000 * 60 * 60 * 24); // every day

  // Serve the app on port 3000
  // this serves both the API and the client.
  const port = 3000;
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${port}`);
  });
})();
