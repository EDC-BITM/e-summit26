"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

function formatSupabaseError(err: any) {
  if (!err) return "Unknown error";

  // Supabase/PostgREST errors are often plain objects, not instances of Error
  const msg = err.message || err.error_description || err.error || "Request failed";
  const details = err.details ? `\nDetails: ${err.details}` : "";
  const hint = err.hint ? `\nHint: ${err.hint}` : "";
  const code = err.code ? `\nCode: ${err.code}` : "";

  return `${msg}${details}${hint}${code}`;
}

export function OnboardingForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    rollNo: "",
    phone: "",
    branch: "",
    whatsappNo: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: userRes, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const user = userRes?.user;
      if (!user) throw new Error("User not authenticated");

      const payload = {
        id: user.id,
        roll_no: formData.rollNo.trim(),
        phone: formData.phone.trim(),
        branch: formData.branch.trim(),
        whatsapp_no: formData.whatsappNo.trim(),
        onboarding_completed: true,
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" });

      if (profileError) {
        console.error("[Onboarding] profiles upsert error:", profileError);
        throw profileError;
      }

      router.push("/protected");
      router.refresh();
    } catch (err: any) {
      console.error("[Onboarding] submit failed:", err);
      setError(formatSupabaseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

        <CardHeader className="relative text-center space-y-2">
          <CardTitle className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Student Information
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            Please fill in your details to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <svg
                    className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <pre className="text-xs text-red-200 flex-1 whitespace-pre-wrap leading-relaxed">
                    {error}
                  </pre>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="rollNo" className="text-white font-medium">
                  Roll Number
                </Label>
                <Input
                  id="rollNo"
                  name="rollNo"
                  type="text"
                  placeholder="Enter your roll number"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch" className="text-white font-medium">
                  Branch
                </Label>
                <Input
                  id="branch"
                  name="branch"
                  type="text"
                  placeholder="Enter your branch (e.g., CSE, ECE)"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNo" className="text-white font-medium">
                  WhatsApp Number
                </Label>
                <Input
                  id="whatsappNo"
                  name="whatsappNo"
                  type="tel"
                  placeholder="Enter your WhatsApp number"
                  value={formData.whatsappNo}
                  onChange={handleInputChange}
                  required
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20"
                />
              </div>

              <Button
                type="submit"
                className="relative cursor-pointer w-full h-14 bg-white hover:bg-white/95 text-gray-900 font-semibold text-base rounded-xl shadow-lg hover:shadow-xl group overflow-hidden transition-all duration-300"
                disabled={isLoading}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/40 to-transparent" />
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="relative z-10">Saving...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Complete Onboarding</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
