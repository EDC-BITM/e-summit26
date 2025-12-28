"use client";

import AnimatedBlurText from "@/components/AnimatedBlurText";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import apiClient_db from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  contact_no: z
    .string()
    .min(10, "Contact number should be 10 digits")
    .max(10, "Contact number should be 10 digits"),
  message: z.string().min(1, "Message is required"),
});

const fetchContactUs = async (data: z.infer<typeof formSchema>) => {
  try {
    const response = await apiClient_db.post("/rest/v1/contact_us", data);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact us form:", error);
    throw error;
  }
};

export default function ContactUs() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      contact_no: "",
      message: "",
    },
  });

  const [submitted, setSubmitted] = useState(false);

  const ContactMutation = useMutation({
    mutationFn: fetchContactUs,
    onMutate: () => {},
    onError: (error) => {
      console.error("Submission error:", error);
    },
    onSuccess: (data) => {
      console.log("Submission successful:", data);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast.promise(ContactMutation.mutateAsync(values), {
        loading: "Sending your message...",
        success: "Message sent successfully!",
        error: "Failed to send your message.",
      });

      form.reset();

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Submit failed:", error);
    }
  }

  return (
    <section className="w-full bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-white/80">
          <span className="h-px w-10 bg-white/70" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Contact
          </span>
        </div>

        {/* Keep your animated text exactly */}
        <h2
          className="
            mt-6
            font-sans
            text-4xl sm:text-5xl md:text-6xl
            leading-[1.05]
            tracking-tight
            font-medium
          "
        >
          <AnimatedBlurText
            lines={["We’d Love to Hear From You Get", "in "]}
            liteText="Touch with Us Today!"
          />
        </h2>

        <p className="mt-5 max-w-2xl text-[16px] leading-6 text-white/60">
          Share a few details and we’ll get back to you. No spam, no fluff.
        </p>

        {/* Clean form card */}
        <div className="mt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div
                className="
                  rounded-2xl
                  bg-[#0e0e12]
                  ring-1 ring-white/10
                  shadow-[0_28px_120px_rgba(0,0,0,0.65)]
                  overflow-hidden
                "
              >
                <div className="p-8">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* First Name */}
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-white/80">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Jane"
                              className="
                                h-11 rounded-xl
                                bg-black/70
                                px-4
                                text-[15px] text-white/90 placeholder:text-white/35
                                ring-1 ring-white/10
                                outline-none
                                focus:ring-white/25
                                transition
                              "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Last Name */}
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel className="text-sm text-white/80">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Smith"
                              className="
                                h-11 rounded-xl
                                bg-black/70
                                px-4
                                text-[15px] text-white/90 placeholder:text-white/35
                                ring-1 ring-white/10
                                outline-none
                                focus:ring-white/25
                                transition
                              "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2 sm:col-span-2">
                          <FormLabel className="text-sm text-white/80">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="jane@company.com"
                              className="
                                h-11 rounded-xl
                                bg-black/70
                                px-4
                                text-[15px] text-white/90 placeholder:text-white/35
                                ring-1 ring-white/10
                                outline-none
                                focus:ring-white/25
                                transition
                              "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact Number */}
                    <FormField
                      control={form.control}
                      name="contact_no"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2 sm:col-span-2">
                          <FormLabel className="text-sm text-white/80">
                            Contact Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="9876543210"
                              className="
                                h-11 rounded-xl
                                bg-black/70
                                px-4
                                text-[15px] text-white/90 placeholder:text-white/35
                                ring-1 ring-white/10
                                outline-none
                                focus:ring-white/25
                                transition
                              "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Query */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2 sm:col-span-2">
                          <FormLabel className="text-sm text-white/80">
                            Your Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Tell us what you need help with..."
                              rows={6}
                              className="
                                rounded-xl min-h-44
                                bg-black/70
                                px-4 py-3
                                text-[15px] text-white/90 placeholder:text-white/35
                                ring-1 ring-white/10
                                outline-none
                                focus:ring-white/25
                                transition
                                resize-y
                              "
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-white/50">
                      By submitting, you agree to be contacted back regarding
                      your query.
                    </div>

                    <Button
                      type="submit"
                      variant={"secondary"}
                      disabled={ContactMutation.status === "pending"}
                    >
                      {ContactMutation.status === "pending"
                        ? "Sending..."
                        : "Submit"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>

          {submitted && (
            <div className="mt-4 rounded-md bg-emerald-800/20 border border-emerald-600/20 p-3 text-emerald-300 text-sm">
              Thanks — we received your message. We&apos;ll get back to you
              shortly.
            </div>
          )}

          <div className="mt-6 text-sm text-white/55">
            Prefer email?{" "}
            <a
              className="text-white/85 underline underline-offset-4 hover:text-white"
              href="mailto:team.edc@bitmesra.ac.in"
            >
              team.edc@bitmesra.ac.in
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
