import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage, updatePaymentStatus, updateSubscriptionStatus, createInvoice, trackPayment, processRefund, sendPaymentNotification, retryFailedPayment, createContract, signContract, versionContract, approveContract, trackContractStatus, sendContractReminder, storeContractFile, retrieveContract, getContractAnalytics, integrateESignature, getContractTemplates, generateContractFromTemplate, sendContractStatusNotification, trackContractAmendment, checkLegalCompliance, handleContractExpiration, startOnboarding, onboardingStep, collectCompanyInfo, submitProjectRequirements, selectBudgetAndTimeline, selectWebsitePlan, trackOnboardingProgress, triggerOnboardingCompletion, multiStepFormWizard, onboardingProgressIndicator, validateOnboardingData, trackOnboardingCompletion, sendWelcomeEmail, getOnboardingChecklist, setupClientPortalAccess, getProjectDashboard, trackMilestone, getProjectProgress, manageProjectTask, uploadProjectFile, sendProjectMessage, getProjectTimeline, updateProjectStatus, completeProjectWorkflow, generateInvoice, getInvoiceTemplates, trackInvoicePayment, manageInvoiceStatus, updateRealTimeProgress, trackMilestoneCompletion, manageProjectFiles, submitClientFeedback, visualizeProjectTimeline, notifyStatusChange, handleProjectCompletion, sendPaymentReminder, getInvoiceHistory, getPaymentPortal, handleLatePayment, getInvoiceStatus, getInvoiceAnalytics, sendEmailNotification } from "./storage";
import { insertContactSubmissionSchema } from "@shared/schema";
import { z } from "zod";
import { PayFast } from 'node-payfast';
import axios from 'axios';
import { supabase } from "../lib/supabaseClient";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import apicache from 'apicache';

const invoiceSchema = z.object({
  amount: z.number().positive(),
  clientId: z.string().uuid(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.string(),
  customFields: z.any().optional(),
  notes: z.string().optional(),
  templateId: z.string().optional(),
  taxRate: z.number().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.json({ success: true, id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit contact form" 
        });
      }
    }
  });

  // Get contact submissions (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch contact submissions" 
      });
    }
  });

  // PayFast ITN webhook endpoint
  app.post("/api/payfast/webhook", async (req, res) => {
    try {
      const payload = req.body;
      console.log("PayFast ITN webhook received:", payload);

      const formBody = Object.entries(payload)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      const validationUrl = process.env.NODE_ENV === 'production'
        ? 'https://www.payfast.co.za/eng/query/validate'
        : 'https://sandbox.payfast.co.za/eng/query/validate';
      const pfRes = await axios.post(validationUrl, formBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      if (pfRes.data === 'VALID') {
        console.log('PayFast ITN: VALID notification');
        // Automated billing and payment status update
        if (payload.payment_status) {
          // Always update both if present
          if (payload.invoice_id) {
            await updatePaymentStatus(payload.invoice_id, payload.payment_status);
            console.log(`[Webhook] Updated invoice ${payload.invoice_id} to status ${payload.payment_status}`);
          }
          if (payload.subscription_id) {
            await updateSubscriptionStatus(payload.subscription_id, payload.payment_status);
            console.log(`[Webhook] Updated subscription ${payload.subscription_id} to status ${payload.payment_status}`);
          }
          // Payment failure/cancellation notification
          if (payload.payment_status === 'FAILED' || payload.payment_status === 'CANCELLED') {
            // TODO: Replace with real notification logic
            console.warn(`[Webhook] Payment failed or cancelled for invoice ${payload.invoice_id || 'N/A'} and subscription ${payload.subscription_id || 'N/A'}`);
            await sendPaymentNotification(payload.email_address || 'admin@yourdomain.com', `Payment failed or cancelled for invoice ${payload.invoice_id || 'N/A'} and subscription ${payload.subscription_id || 'N/A'}`);
          }
          // Log successful payment
          if (payload.payment_status === 'COMPLETE') {
            console.log(`[Webhook] Payment complete for invoice ${payload.invoice_id || 'N/A'} and subscription ${payload.subscription_id || 'N/A'}`);
          }
        }
      } else {
        console.warn('PayFast ITN: INVALID notification');
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('PayFast ITN error:', error);
      res.status(500).json({ success: false, message: "Failed to process PayFast webhook" });
    }
  });

  // PayFast payment initiation endpoint
  app.post("/api/payfast/initiate", async (req, res) => {
    try {
      const { name_first, name_last, email_address, amount, item_name, return_url, cancel_url, notify_url } = req.body;
      const pf = new PayFast({
        merchant_id: process.env.PAYFAST_MERCHANT_ID,
        merchant_key: process.env.PAYFAST_MERCHANT_KEY,
        passphrase: process.env.PAYFAST_PASSPHRASE || undefined,
        sandbox: process.env.NODE_ENV !== 'production',
      });
      const paymentData = {
        return_url,
        cancel_url,
        notify_url,
        name_first,
        name_last,
        email_address,
        amount,
        item_name,
      };
      const urlString = pf.createStringfromObject(paymentData);
      const hash = pf.createSignature(urlString);
      const paymentObject = pf.createPaymentObject(paymentData, hash);
      const paymentUrl = await pf.generatePaymentUrl(paymentObject);
      res.json({ paymentUrl });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to initiate PayFast payment", error: error?.message });
    }
  });

  // PayFast subscription initiation endpoint
  app.post("/api/payfast/subscribe", async (req, res) => {
    try {
      const { name_first, name_last, email_address, amount, item_name, frequency, cycles, return_url, cancel_url, notify_url } = req.body;
      const pf = new PayFast({
        merchant_id: process.env.PAYFAST_MERCHANT_ID,
        merchant_key: process.env.PAYFAST_MERCHANT_KEY,
        passphrase: process.env.PAYFAST_PASSPHRASE || undefined,
        sandbox: process.env.NODE_ENV !== 'production',
      });
      const paymentData = {
        return_url,
        cancel_url,
        notify_url,
        name_first,
        name_last,
        email_address,
        amount,
        item_name,
        subscription_type: '1', // 1 = recurring
        frequency, // e.g. 3 = monthly
        cycles, // 0 = indefinite
      };
      const urlString = pf.createStringfromObject(paymentData);
      const hash = pf.createSignature(urlString);
      const paymentObject = pf.createPaymentObject(paymentData, hash);
      const paymentUrl = await pf.generatePaymentUrl(paymentObject);
      res.json({ paymentUrl });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to initiate PayFast subscription", error: error?.message });
    }
  });

  // Invoice generation endpoint
  /**
   * @api {post} /api/invoice/generate Generate an invoice
   * @apiBody {string} [templateId] Optional template ID for invoice style
   * @apiBody {object} [customFields] Optional custom fields for the invoice
   * @apiBody {string} [notes] Optional notes to include on the invoice
   * @apiBody {...} other standard invoice fields
   */
  app.post("/api/invoice/generate", async (req, res) => {
    try {
      const validated = invoiceSchema.parse(req.body);
      const invoice = await generateInvoice(validated);
      res.json({ success: true, invoice });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid invoice data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to generate invoice" });
      }
    }
  });

  // Invoice templates endpoint
  app.get("/api/invoice/templates", async (_req, res) => {
    try {
      const templates = await getInvoiceTemplates();
      res.json({ success: true, templates });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch invoice templates" });
    }
  });

  // Invoice payment tracking endpoint
  app.post("/api/invoice/track", async (req, res) => {
    try {
      const { invoiceId, status } = req.body;
      await trackInvoicePayment(invoiceId, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to track invoice payment" });
    }
  });

  // Invoice status management endpoint
  app.post("/api/invoice/status", async (req, res) => {
    try {
      const { invoiceId, status } = req.body;
      await manageInvoiceStatus(invoiceId, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to manage invoice status" });
    }
  });

  /**
   * @api {get} /api/invoice/:invoiceId/status Get payment status for an invoice
   * @apiParam {string} invoiceId The ID of the invoice
   * @apiSuccess {string} status The payment status
   */
  app.get("/api/invoice/:invoiceId/status", async (req, res) => {
    try {
      const { invoiceId } = req.params;
      const status = await getInvoiceStatus(invoiceId);
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch invoice status" });
    }
  });

  // Payment tracking endpoint
  app.post("/api/payment/track", async (req, res) => {
    try {
      const { paymentId, status } = req.body;
      await trackPayment(paymentId, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to track payment" });
    }
  });

  // Refund processing endpoint
  app.post("/api/refund", async (req, res) => {
    try {
      const { paymentId, amount } = req.body;
      await processRefund(paymentId, amount);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to process refund" });
    }
  });

  // Payment notification endpoint
  app.post("/api/payment/notify", async (req, res) => {
    try {
      const { userEmail, message } = req.body;
      await sendPaymentNotification(userEmail, message);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send payment notification" });
    }
  });

  // Failed payment retry endpoint
  app.post("/api/payment/retry", async (req, res) => {
    try {
      const { paymentId } = req.body;
      await retryFailedPayment(paymentId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retry payment" });
    }
  });

  // Contract creation endpoint
  app.post("/api/contract", async (req, res) => {
    try {
      const contract = await createContract(req.body);
      res.json({ success: true, contract });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create contract" });
    }
  });

  // Digital signature endpoint
  app.post("/api/contract/sign", async (req, res) => {
    try {
      const { contractId, userId } = req.body;
      await signContract(contractId, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to sign contract" });
    }
  });

  // Contract versioning endpoint
  app.post("/api/contract/version", async (req, res) => {
    try {
      const { contractId, changes } = req.body;
      await versionContract(contractId, changes);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to version contract" });
    }
  });

  // Contract approval endpoint
  app.post("/api/contract/approve", async (req, res) => {
    try {
      const { contractId, approverId } = req.body;
      await approveContract(contractId, approverId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to approve contract" });
    }
  });

  // Contract status tracking endpoint
  app.post("/api/contract/status", async (req, res) => {
    try {
      const { contractId, status } = req.body;
      await trackContractStatus(contractId, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to track contract status" });
    }
  });

  // Contract reminder endpoint
  app.post("/api/contract/reminder", async (req, res) => {
    try {
      const { contractId, userId } = req.body;
      await sendContractReminder(contractId, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send contract reminder" });
    }
  });

  // Contract file storage endpoint
  app.post("/api/contract/store", async (req, res) => {
    try {
      const { contractId, file } = req.body;
      await storeContractFile(contractId, file);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to store contract file" });
    }
  });

  // Contract retrieval endpoint
  app.get("/api/contract/:contractId", async (req, res) => {
    try {
      const contract = await retrieveContract(req.params.contractId);
      res.json({ success: true, contract });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to retrieve contract" });
    }
  });

  // Contract analytics endpoint
  app.get("/api/contract/:contractId/analytics", async (req, res) => {
    try {
      const analytics = await getContractAnalytics(req.params.contractId);
      res.json({ success: true, analytics });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get contract analytics" });
    }
  });

  // E-signature integration endpoint
  app.post("/api/contract/esignature", async (req, res) => {
    try {
      const { contractId, provider } = req.body;
      await integrateESignature(contractId, provider);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to integrate e-signature" });
    }
  });

  // Contract template library endpoint
  app.get("/api/contract/templates", async (_req, res) => {
    try {
      const templates = await getContractTemplates();
      res.json({ success: true, templates });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch contract templates" });
    }
  });

  // Automated contract generation endpoint
  app.post("/api/contract/generate", async (req, res) => {
    try {
      const { templateId, data } = req.body;
      const contract = await generateContractFromTemplate(templateId, data);
      res.json({ success: true, contract });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to generate contract" });
    }
  });

  // Contract status notification endpoint
  app.post("/api/contract/notify", async (req, res) => {
    try {
      const { contractId, userId, status } = req.body;
      await sendContractStatusNotification(contractId, userId, status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send contract status notification" });
    }
  });

  // Contract amendment tracking endpoint
  app.post("/api/contract/amend", async (req, res) => {
    try {
      const { contractId, amendment } = req.body;
      await trackContractAmendment(contractId, amendment);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to track contract amendment" });
    }
  });

  // Legal compliance check endpoint
  app.get("/api/contract/:contractId/compliance", async (req, res) => {
    try {
      const compliance = await checkLegalCompliance(req.params.contractId);
      res.json({ success: true, compliance });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to check legal compliance" });
    }
  });

  // Contract expiration handling endpoint
  app.post("/api/contract/expire", async (req, res) => {
    try {
      const { contractId } = req.body;
      await handleContractExpiration(contractId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to handle contract expiration" });
    }
  });

  // Start onboarding wizard endpoint
  app.post("/api/onboarding/start", async (req, res) => {
    try {
      const { userId } = req.body;
      const onboarding = await startOnboarding(userId);
      res.json({ success: true, onboarding });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to start onboarding" });
    }
  });

  // Onboarding step endpoint
  app.post("/api/onboarding/step", async (req, res) => {
    try {
      const { userId, step, data } = req.body;
      await onboardingStep(userId, step, data);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to process onboarding step" });
    }
  });

  // Company info collection endpoint
  app.post("/api/onboarding/company", async (req, res) => {
    try {
      const { userId, companyInfo } = req.body;
      await collectCompanyInfo(userId, companyInfo);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to collect company info" });
    }
  });

  // Project requirements endpoint
  app.post("/api/onboarding/requirements", async (req, res) => {
    try {
      const { userId, requirements } = req.body;
      await submitProjectRequirements(userId, requirements);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to submit project requirements" });
    }
  });

  // Budget and timeline selection endpoint
  app.post("/api/onboarding/budget-timeline", async (req, res) => {
    try {
      const { userId, budget, timeline } = req.body;
      await selectBudgetAndTimeline(userId, budget, timeline);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to select budget and timeline" });
    }
  });

  // Website plan selection endpoint
  app.post("/api/onboarding/plan", async (req, res) => {
    try {
      const { userId, planId } = req.body;
      await selectWebsitePlan(userId, planId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to select website plan" });
    }
  });

  // Onboarding progress tracking endpoint
  app.post("/api/onboarding/progress", async (req, res) => {
    try {
      const { userId, progress } = req.body;
      await trackOnboardingProgress(userId, progress);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to track onboarding progress" });
    }
  });

  // Onboarding completion trigger endpoint
  app.post("/api/onboarding/complete", async (req, res) => {
    try {
      const { userId } = req.body;
      await triggerOnboardingCompletion(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to complete onboarding" });
    }
  });

  // Multi-step form wizard endpoint
  app.post("/api/onboarding/multistep", async (req, res) => {
    try {
      const { userId, steps } = req.body;
      await multiStepFormWizard(userId, steps);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to process multi-step form wizard" });
    }
  });

  // Onboarding progress indicator endpoint
  app.get("/api/onboarding/progress/:userId", async (req, res) => {
    try {
      const progress = await onboardingProgressIndicator(req.params.userId);
      res.json({ success: true, progress });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get onboarding progress" });
    }
  });

  // Onboarding data validation endpoint
  app.post("/api/onboarding/validate", async (req, res) => {
    try {
      const { userId, data } = req.body;
      const result = await validateOnboardingData(userId, data);
      res.json({ success: true, ...result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to validate onboarding data" });
    }
  });

  // Onboarding completion tracking endpoint
  app.post("/api/onboarding/completion", async (req, res) => {
    try {
      const { userId } = req.body;
      await trackOnboardingCompletion(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to track onboarding completion" });
    }
  });

  // Welcome email sequence endpoint
  app.post("/api/onboarding/welcome", async (req, res) => {
    try {
      const { userId } = req.body;
      await sendWelcomeEmail(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send welcome email" });
    }
  });

  // Onboarding checklist endpoint
  app.get("/api/onboarding/checklist/:userId", async (req, res) => {
    try {
      const checklist = await getOnboardingChecklist(req.params.userId);
      res.json({ success: true, checklist });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get onboarding checklist" });
    }
  });

  // Client portal access setup endpoint
  app.post("/api/onboarding/portal", async (req, res) => {
    try {
      const { userId } = req.body;
      await setupClientPortalAccess(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to setup client portal access" });
    }
  });

  // Project dashboard endpoint
  app.get("/api/project/:projectId/dashboard", async (req, res) => {
    try {
      const dashboard = await getProjectDashboard(req.params.projectId);
      res.json({ success: true, dashboard });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get project dashboard" });
    }
  });

  // Milestone tracking endpoint
  app.post("/api/project/:projectId/milestone", async (req, res) => {
    try {
      await trackMilestone(req.params.projectId, req.body.milestone);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to track milestone" });
    }
  });

  // Project progress indicator endpoint
  app.get("/api/project/:projectId/progress", async (req, res) => {
    try {
      const progress = await getProjectProgress(req.params.projectId);
      res.json({ success: true, progress });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get project progress" });
    }
  });

  // Task management endpoint
  app.post("/api/project/:projectId/task", async (req, res) => {
    try {
      await manageProjectTask(req.params.projectId, req.body.task);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to manage project task" });
    }
  });

  // File upload endpoint
  app.post("/api/project/:projectId/upload", async (req, res) => {
    try {
      await uploadProjectFile(req.params.projectId, req.body.file);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to upload file" });
    }
  });

  // Communication tools endpoint
  app.post("/api/project/:projectId/message", async (req, res) => {
    try {
      await sendProjectMessage(req.params.projectId, req.body.message);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send message" });
    }
  });

  // Project timeline endpoint
  app.get("/api/project/:projectId/timeline", async (req, res) => {
    try {
      const timeline = await getProjectTimeline(req.params.projectId);
      res.json({ success: true, timeline });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get project timeline" });
    }
  });

  // Status updates endpoint
  app.post("/api/project/:projectId/status", async (req, res) => {
    try {
      await updateProjectStatus(req.params.projectId, req.body.status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update project status" });
    }
  });

  // Project completion workflow endpoint
  app.post("/api/project/:projectId/complete", async (req, res) => {
    try {
      await completeProjectWorkflow(req.params.projectId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to complete project workflow" });
    }
  });

  // Real-time progress updates endpoint
  app.post("/api/project/:projectId/progress/realtime", async (req, res) => {
    try {
      await updateRealTimeProgress(req.params.projectId, req.body.progress);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update real-time progress" });
    }
  });

  // Milestone completion tracking endpoint
  app.post("/api/project/:projectId/milestone/complete", async (req, res) => {
    try {
      await trackMilestoneCompletion(req.params.projectId, req.body.milestoneId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to track milestone completion" });
    }
  });

  // File and asset management endpoint
  app.post("/api/project/:projectId/files", async (req, res) => {
    try {
      await manageProjectFiles(req.params.projectId, req.body.fileAction);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to manage project files" });
    }
  });

  // Client feedback endpoint
  app.post("/api/project/:projectId/feedback", async (req, res) => {
    try {
      await submitClientFeedback(req.params.projectId, req.body.feedback);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to submit client feedback" });
    }
  });

  // Project timeline visualization endpoint
  app.get("/api/project/:projectId/timeline/visualize", async (req, res) => {
    try {
      const timeline = await visualizeProjectTimeline(req.params.projectId);
      res.json({ success: true, timeline });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to visualize project timeline" });
    }
  });

  // Status change notifications endpoint
  app.post("/api/project/:projectId/status/notify", async (req, res) => {
    try {
      await notifyStatusChange(req.params.projectId, req.body.status);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to notify status change" });
    }
  });

  // Project completion workflow endpoint
  app.post("/api/project/:projectId/completion", async (req, res) => {
    try {
      await handleProjectCompletion(req.params.projectId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to handle project completion" });
    }
  });

  // Payment reminder endpoint
  app.post("/api/invoice/reminder", async (req, res) => {
    try {
      const { invoiceId, userId } = req.body;
      await sendPaymentReminder(invoiceId, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to send payment reminder" });
    }
  });

  // Invoice history endpoint
  app.get("/api/invoice/history/:userId", async (req, res) => {
    try {
      const history = await getInvoiceHistory(req.params.userId);
      res.json({ success: true, history });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get invoice history" });
    }
  });

  // Payment portal endpoint
  app.get("/api/invoice/portal/:userId", async (req, res) => {
    try {
      const portal = await getPaymentPortal(req.params.userId);
      res.json({ success: true, portal });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get payment portal" });
    }
  });

  // Late payment handling endpoint
  app.post("/api/invoice/late", async (req, res) => {
    try {
      const { invoiceId } = req.body;
      await handleLatePayment(invoiceId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to handle late payment" });
    }
  });

  /**
   * @api {get} /api/invoice/analytics Get invoice analytics
   * @apiSuccess {number} totalInvoiced
   * @apiSuccess {number} totalPaid
   * @apiSuccess {number} overdueCount
   */
  app.get("/api/invoice/analytics", async (_req, res) => {
    try {
      const analytics = await getInvoiceAnalytics();
      res.json({ success: true, ...analytics });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch invoice analytics" });
    }
  });

  // Data Export Endpoint
  app.post("/api/data/export", async (req, res) => {
    try {
      const userId = req.user?.id || req.headers["x-user-id"];
      const isAdmin = req.user?.role === 'admin';
      let exportData = {};
      if (isAdmin && req.body.exportAll) {
        // Export all data (admin)
        const { data: users } = await supabase.from('user_profiles').select('*');
        const { data: clients } = await supabase.from('clients').select('*');
        const { data: invoices } = await supabase.from('invoices').select('*');
        const { data: contracts } = await supabase.from('contracts').select('*');
        const { data: tickets } = await supabase.from('support_tickets').select('*');
        exportData = { users, clients, invoices, contracts, tickets };
        await logAuditEvent('data_export', userId, { all: true });
      } else {
        // Export only this user's data
        const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
        const { data: client } = await supabase.from('clients').select('*').eq('user_id', userId).single();
        const { data: invoices } = await supabase.from('invoices').select('*').eq('client_id', client?.id || null);
        const { data: contracts } = await supabase.from('contracts').select('*').eq('signed_by', userId);
        const { data: tickets } = await supabase.from('support_tickets').select('*').eq('user_id', userId);
        exportData = { profile, client, invoices, contracts, tickets };
        await logAuditEvent('data_export', userId, { all: false });
      }
      res.setHeader('Content-Disposition', 'attachment; filename="export.json"');
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(exportData, null, 2));
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to export data" });
    }
  });

  // Data Import Endpoint (admin only)
  app.post("/api/data/import", async (req, res) => {
    try {
      const isAdmin = req.user?.role === 'admin';
      if (!isAdmin) return res.status(403).json({ success: false, message: "Forbidden" });
      const importData = req.body;
      // Validate structure (basic)
      if (!importData.users || !importData.clients) return res.status(400).json({ success: false, message: "Invalid import data" });
      // Insert data (upsert for idempotency)
      await supabase.from('user_profiles').upsert(importData.users);
      await supabase.from('clients').upsert(importData.clients);
      if (importData.invoices) await supabase.from('invoices').upsert(importData.invoices);
      if (importData.contracts) await supabase.from('contracts').upsert(importData.contracts);
      if (importData.tickets) await supabase.from('support_tickets').upsert(importData.tickets);
      await logAuditEvent('data_import', req.user.id, { count: Object.keys(importData).length });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to import data" });
    }
  });

  // POPIA-compliant user data rights endpoints
  // TODO: Replace req.user.id with real authentication middleware
  app.get("/api/user/data", async (req, res) => {
    try {
      const userId = req.user?.id || req.headers["x-user-id"];
      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
      // Fetch user data from all relevant tables
      const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
      const { data: client } = await supabase.from('clients').select('*').eq('user_id', userId).single();
      res.json({ success: true, profile, client });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user data" });
    }
  });

  app.delete("/api/user/data", async (req, res) => {
    try {
      const userId = req.user?.id || req.headers["x-user-id"];
      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
      // Delete user data from all relevant tables
      await supabase.from('user_profiles').delete().eq('id', userId);
      await supabase.from('clients').delete().eq('user_id', userId);
      // Optionally, delete from auth.users via Supabase Admin API
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete user data" });
    }
  });

  app.patch("/api/user/data", async (req, res) => {
    try {
      const userId = req.user?.id || req.headers["x-user-id"];
      if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
      const updates = req.body;
      const { error: profileError } = await supabase.from('user_profiles').update(updates).eq('id', userId);
      const { error: clientError } = await supabase.from('clients').update(updates).eq('user_id', userId);
      if (profileError && clientError) throw profileError || clientError;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update user data" });
    }
  });

  // --- Analytics & Reporting Endpoints ---
  const analyticsLog = async (endpoint, userId) => {
    await logAuditEvent('analytics_report', userId || 'system', { endpoint });
  };

  app.get('/api/analytics/dashboard', async (req, res) => {
    await analyticsLog('dashboard', req.user?.id);
    res.json({ success: true, data: { users: 100, revenue: 50000, projects: 25, activeClients: 10 } });
  });

  app.get('/api/analytics/revenue', async (req, res) => {
    await analyticsLog('revenue', req.user?.id);
    res.json({ success: true, data: { total: 50000, monthly: [1000, 2000, 3000, 4000, 5000] } });
  });

  app.get('/api/analytics/client', async (req, res) => {
    await analyticsLog('client', req.user?.id);
    res.json({ success: true, data: { newClients: 5, churned: 1, active: 10 } });
  });

  app.get('/api/analytics/project', async (req, res) => {
    await analyticsLog('project', req.user?.id);
    res.json({ success: true, data: { total: 25, completed: 20, inProgress: 5 } });
  });

  app.get('/api/analytics/conversion', async (req, res) => {
    await analyticsLog('conversion', req.user?.id);
    res.json({ success: true, data: { funnel: [100, 50, 20, 10], rate: 0.1 } });
  });

  app.get('/api/analytics/performance', async (req, res) => {
    await analyticsLog('performance', req.user?.id);
    res.json({ success: true, data: { avgResponseTime: 120, uptime: 99.99 } });
  });

  app.post('/api/analytics/custom-report', async (req, res) => {
    await analyticsLog('custom-report', req.user?.id);
    res.json({ success: true, data: { report: 'Custom report data', params: req.body } });
  });

  app.get('/api/reports/financial', async (req, res) => {
    await analyticsLog('financial', req.user?.id);
    res.json({ success: true, data: { income: 50000, expenses: 20000, profit: 30000 } });
  });

  app.get('/api/reports/project-status', async (req, res) => {
    await analyticsLog('project-status', req.user?.id);
    res.json({ success: true, data: { completed: 20, inProgress: 5, overdue: 2 } });
  });

  app.get('/api/reports/client-activity', async (req, res) => {
    await analyticsLog('client-activity', req.user?.id);
    res.json({ success: true, data: { logins: 100, feedback: 15, tickets: 3 } });
  });

  app.get('/api/reports/revenue', async (req, res) => {
    await analyticsLog('revenue-report', req.user?.id);
    res.json({ success: true, data: { total: 50000, byMonth: [1000, 2000, 3000, 4000, 5000] } });
  });

  app.get('/api/reports/conversion-funnel', async (req, res) => {
    await analyticsLog('conversion-funnel', req.user?.id);
    res.json({ success: true, data: { funnel: [100, 50, 20, 10], rate: 0.1 } });
  });

  app.get('/api/reports/performance', async (req, res) => {
    await analyticsLog('performance-report', req.user?.id);
    res.json({ success: true, data: { avgResponseTime: 120, uptime: 99.99 } });
  });

  app.post('/api/reports/custom', async (req, res) => {
    await analyticsLog('custom-report', req.user?.id);
    res.json({ success: true, data: { report: 'Custom report data', params: req.body } });
  });

  const cache = apicache.middleware;

  // --- Swagger/OpenAPI Docs ---
  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: { title: 'CloudMzansi API', version: '1.0.0' },
    },
    apis: ['./server/routes.ts'],
  });
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // --- Versioned API Router ---
  const router = require('express').Router();

  // --- CRUD Endpoints for Major Resources (demo implementations) ---
  // Users
  router.get('/users', async (req, res) => res.json({ success: true, data: [] }));
  router.post('/users', async (req, res) => res.json({ success: true }));
  router.get('/users/:id', async (req, res) => res.json({ success: true, data: {} }));
  router.patch('/users/:id', async (req, res) => res.json({ success: true }));
  router.delete('/users/:id', async (req, res) => res.json({ success: true }));
  // Clients
  router.get('/clients', async (req, res) => res.json({ success: true, data: [] }));
  router.post('/clients', async (req, res) => res.json({ success: true }));
  router.get('/clients/:id', async (req, res) => res.json({ success: true, data: {} }));
  router.patch('/clients/:id', async (req, res) => res.json({ success: true }));
  router.delete('/clients/:id', async (req, res) => res.json({ success: true }));
  // Projects
  router.get('/projects', async (req, res) => res.json({ success: true, data: [] }));
  router.post('/projects', async (req, res) => res.json({ success: true }));
  router.get('/projects/:id', async (req, res) => res.json({ success: true, data: {} }));
  router.patch('/projects/:id', async (req, res) => res.json({ success: true }));
  router.delete('/projects/:id', async (req, res) => res.json({ success: true }));
  // Contracts
  router.get('/contracts', async (req, res) => res.json({ success: true, data: [] }));
  router.post('/contracts', async (req, res) => res.json({ success: true }));
  router.get('/contracts/:id', async (req, res) => res.json({ success: true, data: {} }));
  router.patch('/contracts/:id', async (req, res) => res.json({ success: true }));
  router.delete('/contracts/:id', async (req, res) => res.json({ success: true }));
  // Invoices
  router.get('/invoices', async (req, res) => res.json({ success: true, data: [] }));
  router.post('/invoices', async (req, res) => res.json({ success: true }));
  router.get('/invoices/:id', async (req, res) => res.json({ success: true, data: {} }));
  router.patch('/invoices/:id', async (req, res) => res.json({ success: true }));
  router.delete('/invoices/:id', async (req, res) => res.json({ success: true }));
  // Payments
  router.get('/payments', async (req, res) => res.json({ success: true, data: [] }));
  router.post('/payments', async (req, res) => res.json({ success: true }));
  router.get('/payments/:id', async (req, res) => res.json({ success: true, data: {} }));
  router.patch('/payments/:id', async (req, res) => res.json({ success: true }));
  router.delete('/payments/:id', async (req, res) => res.json({ success: true }));
  // Notifications
  router.get('/notifications', async (req, res) => res.json({ success: true, data: [] }));
  router.post('/notifications', async (req, res) => res.json({ success: true }));
  router.get('/notifications/:id', async (req, res) => res.json({ success: true, data: {} }));
  router.patch('/notifications/:id', async (req, res) => res.json({ success: true }));
  router.delete('/notifications/:id', async (req, res) => res.json({ success: true }));

  // --- Authentication Endpoints (demo) ---
  router.post('/auth/login', async (req, res) => res.json({ success: true, token: 'demo-token' }));
  router.post('/auth/register', async (req, res) => res.json({ success: true }));
  router.post('/auth/logout', async (req, res) => res.json({ success: true }));

  // --- Attach analytics endpoints with caching ---
  router.get('/analytics/dashboard', cache('5 minutes'), async (req, res, next) => next());
  router.get('/analytics/revenue', cache('5 minutes'), async (req, res, next) => next());
  router.get('/analytics/client', cache('5 minutes'), async (req, res, next) => next());
  router.get('/analytics/project', cache('5 minutes'), async (req, res, next) => next());
  router.get('/analytics/conversion', cache('5 minutes'), async (req, res, next) => next());
  router.get('/analytics/performance', cache('5 minutes'), async (req, res, next) => next());

  // --- Mount versioned API router ---
  app.use('/api/v1', router);

  const httpServer = createServer(app);
  return httpServer;
}
