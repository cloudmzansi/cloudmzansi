import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-10 px-4 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-foreground">Privacy Policy</h1>
        <p className="mb-8 text-muted-foreground text-center">
          Last updated: June 2024
        </p>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-muted-foreground">
            Cloud Mzansi is committed to protecting your privacy and ensuring that your personal information is collected and used properly, lawfully, and transparently. This policy explains how we collect, use, disclose, and safeguard your information in accordance with the Protection of Personal Information Act (POPIA) and other applicable South African laws.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">2. What Data We Collect</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Personal identification information (name, email address, phone number, etc.)</li>
            <li>Business information (company name, website, etc.)</li>
            <li>Usage data (pages visited, time spent, browser/device info)</li>
            <li>Cookies and tracking data</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">3. How We Use Data</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>To provide and maintain our services</li>
            <li>To communicate with you about your project or inquiry</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">4. Cookies</h2>
          <p className="text-muted-foreground">
            We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie preferences in your browser settings. For more details, see our Cookie Policy.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>You have the right to access, correct, or delete your personal information.</li>
            <li>You may object to or restrict our processing of your data.</li>
            <li>You may withdraw consent at any time, where applicable.</li>
            <li>To exercise your rights, contact us using the details below.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">7. Contact Information</h2>
          <p className="text-muted-foreground">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
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