"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Silk from "@/components/Silk";
import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingPage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Silk background */}
      <div className="absolute inset-0">
        <Silk
          speed={5}
          scale={1}
          color="#B05EC2"
          noiseIntensity={1.5}
          rotation={0}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/40" />

      {/* Decorative cubes */}
      <Image
        width={200}
        height={200}
        src="/Cube.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute z-0 -left-20 top-[10%] w-40 md:w-60 opacity-80 mix-blend-screen animate-[spin_24s_linear_infinite]"
        style={{ transform: "rotate(12deg)" }}
      />

      <Image
        width={200}
        height={200}
        src="/Triangle.png"
        alt=""
        draggable={false}
        className="pointer-events-none absolute z-0 -right-10 bottom-[15%] w-48 md:w-72 opacity-80 mix-blend-screen animate-[spin_24s_linear_infinite]"
        style={{ animationDirection: "reverse" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Complete Your Profile
          </h1>
          <p className="text-white/60">
            We need a few more details to get you started
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <OnboardingForm />
        </motion.div>
      </div>
    </section>
  );
}
