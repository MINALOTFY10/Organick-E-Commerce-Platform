"use client";
import React, { useState, useRef, Fragment } from "react";
import { submitContactForm } from "@/actions/contact-actions";
import PrimaryButton from "@/components/ui/primary-button";

export default function FeedbackForm() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setResult(null);
    setFieldErrors({});

    const formData = new FormData(formRef.current!);
    const response = await submitContactForm(formData);

    setPending(false);
    setResult({ success: response.success, message: response.message });

    if (response.errors) {
      setFieldErrors(response.errors);
    }

    if (response.success) {
      formRef.current?.reset();
    }
  };

  const hasError = (field: string) => !!fieldErrors[field]?.length;

  const inputClasses = (field: string) =>
    `mt-2 block w-full border rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#274C5B] transition-all placeholder:italic placeholder:text-gray-400 ${
      hasError(field) ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
    }`;

  const content = (
    <Fragment>
      <form ref={formRef} onSubmit={submitHandler} className="w-full mb-8" aria-label="Contact form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Full Name */}
          <div className="flex flex-col">
            <label htmlFor="contact-name" className="font-bold text-(--primary-color) text-lg ml-1">
              Full Name
            </label>
            <input
              id="contact-name"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              className={inputClasses("fullName")}
              placeholder="Your Full Name"
            />
            {hasError("fullName") && <p className="text-red-500 text-sm mt-1 ml-1">{fieldErrors.fullName[0]}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label htmlFor="contact-email" className="font-bold text-(--primary-color) text-lg ml-1">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputClasses("email")}
              placeholder="example@yourmail.com"
            />
            {hasError("email") && <p className="text-red-500 text-sm mt-1 ml-1">{fieldErrors.email[0]}</p>}
          </div>

          {/* Company */}
          <div className="flex flex-col">
            <label htmlFor="contact-company" className="font-bold text-(--primary-color) text-lg ml-1">
              Company
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              autoComplete="organization"
              className={inputClasses("company")}
              placeholder="Your company name"
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label htmlFor="contact-phone" className="font-bold text-(--primary-color) text-lg ml-1">
              Phone Number
            </label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" className={inputClasses("phone")} placeholder="01123456789" />
          </div>
        </div>

        {/* Message Field */}
        <div className="mt-6 flex flex-col">
          <label htmlFor="contact-message" className="font-bold text-(--primary-color) text-lg ml-1">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            className={inputClasses("message")}
            placeholder="Write your message here..."
          />
          {hasError("message") && <p className="text-red-500 text-sm mt-1 ml-1">{fieldErrors.message[0]}</p>}
        </div>

        {/* Submit Button */}
        <div className="mt-8 w-full">
          <PrimaryButton type="submit" className="ms-auto">
            {pending ? "Sending..." : "Send Message"}
          </PrimaryButton>
        </div>

        {result && (
          <div
            className={`mt-4 p-4 rounded-md text-sm font-medium ${
              result.success ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {result.message}
          </div>
        )}
      </form>
    </Fragment>
  );

  return <div className="w-full max-w-5xl mx-auto px-4">{content}</div>;
}
