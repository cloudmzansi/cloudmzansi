import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-10 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-foreground">Terms of Service</h1>
        <p className="mb-8 text-muted-foreground text-center">
          Last updated: June 2024
        </p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-muted-foreground">
            These Terms of Service ("Terms") govern your use of the Cloud Mzansi website and services. By accessing or using our site, you agree to be bound by these Terms and all applicable South African laws and regulations.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By using our website or services, you acknowledge that you have read, understood, and agree to these Terms. If you do not agree, please do not use our services.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. Services Provided</h2>
          <p className="text-muted-foreground">
            Cloud Mzansi provides web design, development, and related digital services to South African businesses. Service details, deliverables, and timelines will be agreed upon in writing for each project.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. User Responsibilities</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Provide accurate and complete information when requested.</li>
            <li>Comply with all applicable laws and regulations.</li>
            <li>Do not use our services for unlawful or harmful purposes.</li>
            <li>Respect our intellectual property and confidential information.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
          <p className="text-muted-foreground">
            All content, designs, and code provided by Cloud Mzansi remain our intellectual property unless otherwise agreed in writing. You may not reproduce, distribute, or use our materials without permission.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            Cloud Mzansi is not liable for any indirect, incidental, or consequential damages arising from your use of our website or services. Our total liability is limited to the amount paid for services rendered.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. Termination</h2>
          <p className="text-muted-foreground">
            We reserve the right to suspend or terminate your access to our services at any time, for any reason, including violation of these Terms.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">8. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms are governed by the laws of the Republic of South Africa. Any disputes will be resolved in South African courts.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">9. Contact Information</h2>
          <p className="text-muted-foreground">
            For questions about these Terms, please contact us at:
            <br />
            <span className="font-medium">Email:</span> info@cloudmzansi.co.za
            <br />
            <span className="font-medium">Phone:</span> +27 74 839 4350
          </p>
        </section>
      </div>
    </div>
  );
} 