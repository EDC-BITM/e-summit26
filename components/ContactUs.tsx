"use client";

import { useState } from "react";
import AnimatedBlurText from "@/components/AnimatedBlurText";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
  contactNumber: z.string().min(1, "Contact number is required"),
  message: z.string().min(1, "Message is required"),
});

export default function ContactUs() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // setStatus("submitting");
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
            font-['Inter',ui-sans-serif,system-ui]
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
                      name="firstName"
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
                      name="lastName"
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
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2 sm:col-span-2">
                          <FormLabel className="text-sm text-white/80">
                            Contact Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+91 9876543210"
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
                      disabled={status === "submitting"}
                    >
                      {status === "submitting"
                        ? "Sending..."
                        : status === "sent"
                        ? "Sent"
                        : "Submit"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </Form>

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
