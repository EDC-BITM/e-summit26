import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  await headers(); // Force dynamic behavior
  try {
    const supabase = await createServiceClient();

    // 1. Create the bucket if it doesn't exist
    const { data: bucket, error: bucketError } = await supabase.storage.createBucket('registrations', {
      public: true,
      allowedMimeTypes: ['image/*', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
      fileSizeLimit: 10485760 // 10MB
    });

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        return NextResponse.json({ message: "Bucket 'registrations' already exists." });
      }
      throw bucketError;
    }

    return NextResponse.json({ 
      message: "Bucket 'registrations' created successfully!",
      details: bucket 
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: "Failed to setup storage", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
