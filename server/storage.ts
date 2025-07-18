import { contactSubmissions, type ContactSubmission, type InsertContactSubmission } from "@shared/schema";
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
// Remove direct import of createClient and use the shared supabase client
import { supabase } from './lib/supabaseClient';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

// Remove direct instantiation of supabase client
// export const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

export interface IStorage {
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

export class MemStorage implements IStorage {
  private submissions: Map<number, ContactSubmission>;
  private currentId: number;

  constructor() {
    this.submissions = new Map();
    this.currentId = 1;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = this.currentId++;
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.submissions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export async function updatePaymentStatus(invoiceId: string, status: string) {
  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId);
  if (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
}

export async function updateSubscriptionStatus(subscriptionId: string, status: string) {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status })
    .eq('id', subscriptionId);
  if (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
}

export async function createInvoice(data: any) {
  // TODO: Implement invoice creation in DB
  console.log('Creating invoice:', data);
  return { id: 'demo-invoice-id', ...data };
}

export async function trackPayment(paymentId: string, status: string) {
  // TODO: Implement payment tracking in DB
  console.log(`Tracking payment ${paymentId} with status: ${status}`);
}

export async function processRefund(paymentId: string, amount: number) {
  // TODO: Implement refund logic with PayFast API
  console.log(`Processing refund for payment ${paymentId} of amount: ${amount}`);
}

export async function sendPaymentNotification(userEmail: string, message: string) {
  // TODO: Implement email or webhook notification
  console.log(`Sending payment notification to ${userEmail}: ${message}`);
}

export async function retryFailedPayment(paymentId: string) {
  // TODO: Implement retry logic for failed payments
  console.log(`Retrying failed payment: ${paymentId}`);
}

export async function createContract(data: any) {
  // TODO: Implement contract creation in DB
  console.log('Creating contract:', data);
  return { id: 'demo-contract-id', ...data };
}

export async function signContract(contractId: string, userId: string) {
  // TODO: Implement digital signature logic
  console.log(`User ${userId} signed contract ${contractId}`);
}

export async function versionContract(contractId: string, changes: any) {
  // TODO: Implement contract versioning
  console.log(`Versioning contract ${contractId} with changes:`, changes);
}

export async function approveContract(contractId: string, approverId: string) {
  // TODO: Implement contract approval workflow
  console.log(`Approver ${approverId} approved contract ${contractId}`);
}

export async function trackContractStatus(contractId: string, status: string) {
  // TODO: Implement contract status tracking
  console.log(`Tracking contract ${contractId} status: ${status}`);
}

export async function sendContractReminder(contractId: string, userId: string) {
  // TODO: Implement contract reminder logic
  console.log(`Sending contract reminder for contract ${contractId} to user ${userId}`);
}

export async function storeContractFile(contractId: string, file: any) {
  // TODO: Implement contract file storage
  console.log(`Storing file for contract ${contractId}`);
}

export async function retrieveContract(contractId: string) {
  // TODO: Implement contract retrieval
  console.log(`Retrieving contract ${contractId}`);
  return { id: contractId, content: 'Demo contract content' };
}

export async function getContractAnalytics(contractId: string) {
  // TODO: Implement contract analytics
  console.log(`Getting analytics for contract ${contractId}`);
  return { views: 0, signatures: 0 };
}

export async function integrateESignature(contractId: string, provider: string) {
  // TODO: Integrate with e-signature provider (e.g., DocuSign, HelloSign)
  console.log(`Integrating e-signature for contract ${contractId} with provider ${provider}`);
}

export async function getContractTemplates() {
  // TODO: Return contract template library
  console.log('Fetching contract templates');
  return [{ id: 'template-1', name: 'Standard Agreement' }];
}

export async function generateContractFromTemplate(templateId: string, data: any) {
  // TODO: Generate contract from template
  console.log(`Generating contract from template ${templateId} with data:`, data);
  return { id: 'generated-contract-id', ...data };
}

export async function sendContractStatusNotification(contractId: string, userId: string, status: string) {
  // TODO: Send contract status notification
  console.log(`Sending contract status notification for contract ${contractId} to user ${userId} with status ${status}`);
}

export async function trackContractAmendment(contractId: string, amendment: any) {
  // TODO: Track contract amendment
  console.log(`Tracking amendment for contract ${contractId}:`, amendment);
}

export async function checkLegalCompliance(contractId: string) {
  // TODO: Check contract for legal compliance
  console.log(`Checking legal compliance for contract ${contractId}`);
  return { compliant: true };
}

export async function handleContractExpiration(contractId: string) {
  // TODO: Handle contract expiration
  console.log(`Handling expiration for contract ${contractId}`);
}

export async function startOnboarding(userId: string) {
  // TODO: Start onboarding wizard for user
  console.log(`Starting onboarding for user ${userId}`);
  return { onboardingId: 'demo-onboarding-id', userId };
}

export async function onboardingStep(userId: string, step: string, data: any) {
  // TODO: Handle onboarding step
  console.log(`User ${userId} onboarding step ${step}:`, data);
}

export async function collectCompanyInfo(userId: string, companyInfo: any) {
  // TODO: Collect company information
  console.log(`Collecting company info for user ${userId}:`, companyInfo);
}

export async function submitProjectRequirements(userId: string, requirements: any) {
  // TODO: Submit project requirements
  console.log(`Submitting project requirements for user ${userId}:`, requirements);
}

export async function selectBudgetAndTimeline(userId: string, budget: string, timeline: string) {
  // TODO: Select budget and timeline
  console.log(`User ${userId} selected budget ${budget} and timeline ${timeline}`);
}

export async function selectWebsitePlan(userId: string, planId: string) {
  // TODO: Select website plan
  console.log(`User ${userId} selected website plan ${planId}`);
}

export async function trackOnboardingProgress(userId: string, progress: any) {
  // TODO: Track onboarding progress
  console.log(`Tracking onboarding progress for user ${userId}:`, progress);
}

export async function triggerOnboardingCompletion(userId: string) {
  // TODO: Trigger onboarding completion
  console.log(`Onboarding completed for user ${userId}`);
}

export async function multiStepFormWizard(userId: string, steps: any[]) {
  // TODO: Implement multi-step form wizard logic
  console.log(`Multi-step form wizard for user ${userId} with steps:`, steps);
}

export async function onboardingProgressIndicator(userId: string) {
  // TODO: Return onboarding progress indicator
  console.log(`Getting onboarding progress indicator for user ${userId}`);
  return { progress: 0 };
}

export async function validateOnboardingData(userId: string, data: any) {
  // TODO: Validate onboarding data
  console.log(`Validating onboarding data for user ${userId}:`, data);
  return { valid: true };
}

export async function trackOnboardingCompletion(userId: string) {
  // TODO: Track onboarding completion
  console.log(`Tracking onboarding completion for user ${userId}`);
}

export async function sendWelcomeEmail(userId: string) {
  // TODO: Send welcome email sequence
  console.log(`Sending welcome email to user ${userId}`);
}

export async function getOnboardingChecklist(userId: string) {
  // TODO: Return onboarding checklist
  console.log(`Getting onboarding checklist for user ${userId}`);
  return [{ step: 'Register', completed: true }];
}

export async function setupClientPortalAccess(userId: string) {
  // TODO: Setup client portal access
  console.log(`Setting up client portal access for user ${userId}`);
}

export async function getProjectDashboard(projectId: string) {
  // TODO: Return project dashboard data
  console.log(`Getting dashboard for project ${projectId}`);
  return { projectId, status: 'pending' };
}

export async function trackMilestone(projectId: string, milestone: any) {
  // TODO: Track project milestone
  console.log(`Tracking milestone for project ${projectId}:`, milestone);
}

export async function getProjectProgress(projectId: string) {
  // TODO: Return project progress indicator
  console.log(`Getting progress for project ${projectId}`);
  return { progress: 0 };
}

export async function manageProjectTask(projectId: string, task: any) {
  // TODO: Manage project task
  console.log(`Managing task for project ${projectId}:`, task);
}

export async function uploadProjectFile(projectId: string, file: any) {
  // TODO: Handle file upload for project
  console.log(`Uploading file for project ${projectId}`);
}

export async function sendProjectMessage(projectId: string, message: any) {
  // TODO: Handle project communication
  console.log(`Sending message for project ${projectId}:`, message);
}

export async function getProjectTimeline(projectId: string) {
  // TODO: Return project timeline
  console.log(`Getting timeline for project ${projectId}`);
  return { timeline: [] };
}

export async function updateProjectStatus(projectId: string, status: string) {
  // TODO: Update project status
  console.log(`Updating status for project ${projectId} to ${status}`);
}

export async function completeProjectWorkflow(projectId: string) {
  // TODO: Handle project completion workflow
  console.log(`Completing workflow for project ${projectId}`);
}

export async function generateInvoice(data: any) {
  // Always use ZAR as currency
  const { customFields, notes, templateId, taxRate = 0, amount = 0, ...rest } = data;
  const currency = 'ZAR';
  const taxAmount = amount * taxRate;
  const total = amount + taxAmount;
  const insertData = { ...rest, customFields, notes, templateId, taxRate, taxAmount, total, currency };
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert([insertData])
    .select()
    .single();
  if (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
  return invoice;
}

export async function getInvoiceTemplates() {
  // TODO: Return invoice templates
  console.log('Fetching invoice templates');
  return [{ id: 'template-1', name: 'Standard Invoice' }];
}

export async function trackInvoicePayment(invoiceId: string, status: string) {
  // TODO: Track invoice payment
  console.log(`Tracking payment for invoice ${invoiceId} with status: ${status}`);
}

export async function manageInvoiceStatus(invoiceId: string, status: string) {
  // TODO: Manage invoice status
  console.log(`Managing status for invoice ${invoiceId}: ${status}`);
}

export async function updateRealTimeProgress(projectId: string, progress: any) {
  // TODO: Update real-time progress for project
  console.log(`Updating real-time progress for project ${projectId}:`, progress);
}

export async function trackMilestoneCompletion(projectId: string, milestoneId: string) {
  // TODO: Track milestone completion
  console.log(`Tracking completion of milestone ${milestoneId} for project ${projectId}`);
}

export async function manageProjectFiles(projectId: string, fileAction: any) {
  // TODO: Manage files and assets for project
  console.log(`Managing files for project ${projectId}:`, fileAction);
}

export async function submitClientFeedback(projectId: string, feedback: any) {
  // TODO: Submit client feedback
  console.log(`Submitting client feedback for project ${projectId}:`, feedback);
}

export async function visualizeProjectTimeline(projectId: string) {
  // TODO: Visualize project timeline
  console.log(`Visualizing timeline for project ${projectId}`);
  return { timeline: [] };
}

export async function notifyStatusChange(projectId: string, status: string) {
  // TODO: Notify status change
  console.log(`Notifying status change for project ${projectId} to ${status}`);
}

export async function handleProjectCompletion(projectId: string) {
  // TODO: Handle project completion workflow
  console.log(`Handling completion workflow for project ${projectId}`);
}

export async function sendPaymentReminder(invoiceId: string, userId: string) {
  // TODO: Send payment reminder
  console.log(`Sending payment reminder for invoice ${invoiceId} to user ${userId}`);
}

export async function getInvoiceHistory(userId: string) {
  // TODO: Return invoice history for user
  console.log(`Getting invoice history for user ${userId}`);
  return [];
}

export async function getPaymentPortal(userId: string) {
  // TODO: Return payment portal info for user
  console.log(`Getting payment portal for user ${userId}`);
  return { url: 'https://demo-payment-portal.com' };
}

export async function handleLatePayment(invoiceId: string) {
  // TODO: Handle late payment logic
  console.log(`Handling late payment for invoice ${invoiceId}`);
}

export async function getDueSubscriptions() {
  // Fetch active subscriptions that are due for billing
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('status', 'active')
    .or(`end_date.is.null,end_date.gte.${today}`);
  if (error) {
    console.error('Error fetching due subscriptions:', error);
    return [];
  }
  // TODO: Add logic to check if a new invoice is due based on billing_cycle and last invoice date
  return data || [];
}

export async function getOverdueInvoices() {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('status', 'pending')
    .lt('due_date', today);
  if (error) {
    console.error('Error fetching overdue invoices:', error);
    return [];
  }
  return data || [];
}

export async function sendLatePaymentNotification(invoiceId: string, userId: string) {
  // TODO: Integrate with email/SMS/notification system
  console.log(`Late payment notification sent for invoice ${invoiceId} to user ${userId}`);
}

export async function getInvoiceStatus(invoiceId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('status')
    .eq('id', invoiceId)
    .single();
  if (error) {
    console.error('Error fetching invoice status:', error);
    throw error;
  }
  return data?.status;
}

export async function getInvoiceAnalytics() {
  // Total invoiced
  const { data: all, error: allError } = await supabase
    .from('invoices')
    .select('amount, status, due_date');
  if (allError) {
    console.error('Error fetching invoices for analytics:', allError);
    throw allError;
  }
  let totalInvoiced = 0, totalPaid = 0, overdueCount = 0;
  const today = new Date().toISOString().slice(0, 10);
  for (const inv of all || []) {
    totalInvoiced += Number(inv.amount || 0);
    if (inv.status === 'paid') totalPaid += Number(inv.amount || 0);
    if (inv.status === 'pending' && inv.due_date < today) overdueCount++;
  }
  return { totalInvoiced, totalPaid, overdueCount };
}

export async function logAuditEvent(event: string, userId: string, meta: any = {}) {
  await supabase.from('audit_logs').insert([{ event, user_id: userId, meta, timestamp: new Date().toISOString() }]);
}

export async function runDataRetentionJob() {
  const now = new Date();
  // User profiles: 5 years after last activity
  const userCutoff = new Date(now);
  userCutoff.setFullYear(userCutoff.getFullYear() - 5);
  const { data: oldUsers } = await supabase.from('user_profiles').select('id, updated_at').lt('updated_at', userCutoff.toISOString());
  for (const user of oldUsers || []) {
    await supabase.from('user_profiles').delete().eq('id', user.id);
    await logAuditEvent('data_retention_delete', user.id, { table: 'user_profiles' });
  }
  // Invoices: 7 years
  const invoiceCutoff = new Date(now);
  invoiceCutoff.setFullYear(invoiceCutoff.getFullYear() - 7);
  const { data: oldInvoices } = await supabase.from('invoices').select('id, client_id, created_at').lt('created_at', invoiceCutoff.toISOString());
  for (const inv of oldInvoices || []) {
    await supabase.from('invoices').delete().eq('id', inv.id);
    await logAuditEvent('data_retention_delete', inv.client_id, { table: 'invoices', invoiceId: inv.id });
  }
  // Contracts: 7 years
  const contractCutoff = new Date(now);
  contractCutoff.setFullYear(contractCutoff.getFullYear() - 7);
  const { data: oldContracts } = await supabase.from('contracts').select('id, signed_by, created_at').lt('created_at', contractCutoff.toISOString());
  for (const contract of oldContracts || []) {
    await supabase.from('contracts').delete().eq('id', contract.id);
    await logAuditEvent('data_retention_delete', contract.signed_by, { table: 'contracts', contractId: contract.id });
  }
  // Support tickets: 2 years
  const ticketCutoff = new Date(now);
  ticketCutoff.setFullYear(ticketCutoff.getFullYear() - 2);
  const { data: oldTickets } = await supabase.from('support_tickets').select('id, user_id, created_at').lt('created_at', ticketCutoff.toISOString());
  for (const ticket of oldTickets || []) {
    await supabase.from('support_tickets').delete().eq('id', ticket.id);
    await logAuditEvent('data_retention_delete', ticket.user_id, { table: 'support_tickets', ticketId: ticket.id });
  }
}

export async function sendEmailNotification(to: string, subject: string, body: string) {
  // Log to console
  console.log(`[EMAIL] To: ${to}\nSubject: ${subject}\nBody: ${body}`);
  // Store in DB for audit/testing
  await supabase.from('email_notifications').insert([{ to, subject, body, sent_at: new Date().toISOString() }]);
}

export const storage = new MemStorage();
