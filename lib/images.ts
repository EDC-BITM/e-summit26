import { CldImage } from "next-cloudinary";

/**
 * Centralized Image Assets Configuration
 * Use this file to manage all image URLs (Local & Cloudinary)
 */

export { CldImage as cldImage }; // Aliased to match user request
export { CldImage };

export const IMAGES = {
  logos: {
    main: "/Esum26new.png",
    // Example Cloudinary logo
    cloudinaryLogo: "https://res.cloudinary.com/dvui49kut/image/upload/v1768272625/FUTUREOFBUSINESS_rtwz7c.png",
  },
  hero: {
    cube: "/Cube.png",
    triangle: "/Triangle.png",
    stack: "/Stack.png",
    footerBg: "/FooterBG.jpg",
  },
  past_speakers: {
    vijender_chauhan: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379922/vijender_irpyql.jpg",
    karan_bajaj: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379874/karan_hvidwt.png",
    amit_chaudhry: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379871/amit_jskhul.png",
    muskaan_sancheti: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379874/muskaan_ovcsbr.jpg",
    aman_dhattarwal: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379871/aman_bdibag.png",
    ashutosh_naik: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
  },
  team: {
    // Add team member images here
    placeholder: "https://images.unsplash.com/photo-152202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  events: {
    // Add event imagery here
    openingBanner: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e.avif",
  },
  sponsors: [
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 450,
      height: 237,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 450,
      height: 120,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 866,
      height: 650,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 866,
      height: 650,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 866,
      height: 650,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 866,
      height: 650,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 225,
      height: 225,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 225,
      height: 225,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 100,
      height: 100,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 299,
      height: 168,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 800,
      height: 600,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 511,
      height: 181,
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 866,
      height: 650,
   
    },
    {
      publicId: "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
      width: 866,
      height: 650,
    },
  ],
  misc: {
    placeholder:
      "",
  },
};

export type ImageAssets = typeof IMAGES;
