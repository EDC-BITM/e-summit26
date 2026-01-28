"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit2,
  Save,
  X,
  Loader2,
  User as UserIcon,
  Phone,
  Mail,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import Image from "next/image";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  roll_no: string | null;
  phone: string | null;
  whatsapp_no: string | null;
  college: string | null;
  branch: string | null;
  gender: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    roll_no: "",
    phone: "",
    whatsapp_no: "",
    college: "",
    branch: "",
    gender: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?redirect=/profile");
        return;
      }

      setUser(user);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(profileData);
        setFormData({
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          roll_no: profileData.roll_no || "",
          phone: profileData.phone || "",
          whatsapp_no: profileData.whatsapp_no || "",
          college: profileData.college || "",
          branch: profileData.branch || "",
          gender: profileData.gender || "",
        });
      }
      setLoading(false);
    };

    getUser();
  }, [supabase, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } else {
      setProfile({ ...profile, ...formData } as Profile);
      setEditMode(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    }
    setSaving(false);
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        roll_no: profile.roll_no || "",
        phone: profile.phone || "",
        whatsapp_no: profile.whatsapp_no || "",
        college: profile.college || "",
        branch: profile.branch || "",
        gender: profile.gender || "",
      });
    }
    setEditMode(false);
  };

  const getInitials = () => {
    if (formData.first_name && formData.last_name) {
      return `${formData.first_name[0]}${formData.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-[#733080]" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-br from-black via-[#0a0015] to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#733080]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#B05EC2]/10 rounded-full blur-[120px]" />

        {/* Content */}
        <div className="relative z-10 pt-24 pb-20 px-4">
          {/* Hero Section */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                My Profile
              </h1>
              <p className="text-gray-400 text-lg">
                Manage your E-Summit 2026 account
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto">
            {/* Profile Header Card */}
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 mb-6 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-[#733080]/5 via-transparent to-[#B05EC2]/5" />
              <CardHeader className="relative">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <Avatar className="h-32 w-32 border-4 border-[#733080]/30 shadow-[0_0_30px_rgba(115,48,128,0.3)]">
                      <AvatarImage
                        src={user?.user_metadata?.avatar_url}
                        alt={`${formData.first_name} ${formData.last_name}`}
                      />
                      <AvatarFallback className="bg-linear-to-br from-[#733080] to-[#B05EC2] text-white text-4xl font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                      <CardTitle className="text-3xl md:text-4xl text-white mb-2">
                        {formData.first_name && formData.last_name
                          ? `${formData.first_name} ${formData.last_name}`
                          : "Your Profile"}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-lg flex items-center gap-2 justify-center md:justify-start">
                        <Mail className="h-4 w-4" />
                        {user?.email}
                      </CardDescription>
                      {formData.roll_no && (
                        <div className="mt-2 flex items-center gap-2 text-gray-400 justify-center md:justify-start">
                          <GraduationCap className="h-4 w-4" />
                          <span>{formData.roll_no}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {!editMode ? (
                    <Button
                      onClick={() => setEditMode(true)}
                      className="bg-linear-to-r from-[#733080] to-[#B05EC2] hover:from-[#733080]/90 hover:to-[#B05EC2]/90 text-white shadow-[0_0_20px_rgba(115,48,128,0.4)]"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-white/20 bg-white/10 hover:bg-white/20 text-white"
                        disabled={saving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-linear-to-r from-[#733080] to-[#B05EC2] hover:from-[#733080]/90 hover:to-[#B05EC2]/90 text-white shadow-[0_0_20px_rgba(115,48,128,0.4)]"
                        disabled={saving}
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-[#733080]" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name"
                      className="text-white/80 text-sm"
                    >
                      First Name
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-70 disabled:cursor-not-allowed focus:border-[#733080] transition-all"
                      placeholder="Enter first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name"
                      className="text-white/80 text-sm"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-70 disabled:cursor-not-allowed focus:border-[#733080] transition-all"
                      placeholder="Enter last name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white/80 text-sm">
                      Gender
                    </Label>
                    {editMode ? (
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#733080] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                      >
                        <option value="" className="bg-black">
                          Select gender
                        </option>
                        <option value="male" className="bg-black">
                          Male
                        </option>
                        <option value="female" className="bg-black">
                          Female
                        </option>
                        <option value="other" className="bg-black">
                          Other
                        </option>
                      </select>
                    ) : (
                      <Input
                        id="gender"
                        value={formData.gender || "Not specified"}
                        disabled
                        className="bg-white/5 border-white/10 text-white disabled:opacity-70 disabled:cursor-not-allowed capitalize"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information Card */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-[#733080]" />
                    Academic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="college" className="text-white/80 text-sm">
                      College
                    </Label>
                    <Input
                      id="college"
                      name="college"
                      value={formData.college}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-70 disabled:cursor-not-allowed focus:border-[#733080] transition-all"
                      placeholder="Enter college name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roll_no" className="text-white/80 text-sm">
                      Roll Number
                    </Label>
                    <Input
                      id="roll_no"
                      name="roll_no"
                      value={formData.roll_no}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-70 disabled:cursor-not-allowed focus:border-[#733080] transition-all"
                      placeholder="Enter roll number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch" className="text-white/80 text-sm">
                      Branch / Department
                    </Label>
                    <Input
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-70 disabled:cursor-not-allowed focus:border-[#733080] transition-all"
                      placeholder="Enter branch/department"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information Card - Full Width */}
              <Card className="bg-black/40 backdrop-blur-xl border-white/10 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#733080]" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/80 text-sm">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-70 disabled:cursor-not-allowed focus:border-[#733080] transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="whatsapp_no"
                      className="text-white/80 text-sm"
                    >
                      WhatsApp Number
                    </Label>
                    <Input
                      id="whatsapp_no"
                      name="whatsapp_no"
                      type="tel"
                      value={formData.whatsapp_no}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="bg-white/5 border-white/10 text-white disabled:opacity-70 disabled:cursor-not-allowed focus:border-[#733080] transition-all"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
