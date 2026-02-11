import { CldImage } from "next-cloudinary";

/**
 * Centralized Image Assets Configuration
 * Use this file to manage all image URLs (Local & Cloudinary)
 */

export { CldImage };

export const IMAGES = {
  logos: {
    main: "/Esum26new.png",
    // Example Cloudinary logo
    cloudinaryLogo:
      "https://res.cloudinary.com/dvui49kut/image/upload/v1768272625/FUTUREOFBUSINESS_rtwz7c.png",
  },
  hero: {
    cube: "/Cube.png",
    triangle: "/Triangle.png",
    stack: "/Stack.png",
    footerBg: "/FooterBG.jpg",
  },
  past_speakers: {
    vijender_chauhan:
      "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379922/vijender_irpyql.jpg",
    karan_bajaj:
      "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379874/karan_hvidwt.png",
    amit_chaudhry:
      "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379871/amit_jskhul.png",
    muskaan_sancheti:
      "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379874/muskaan_ovcsbr.jpg",
    aman_dhattarwal:
      "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379871/aman_bdibag.png",
    ashutosh_naik:
      "https://res.cloudinary.com/dnrkdqp3q/image/upload/v1769379872/ashutoshh_ibtcdf.jpg",
  },
  team: {
    // Add team member images here
    placeholder:
      "https://images.unsplash.com/photo-152202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
  events: {
    // Add event imagery here
    openingBanner:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e.avif",
  },
  sponsors: [
    {
      publicId: "1113718_yrsoir",
      width: 450,
      height: 237,
    },
    {
      publicId: "typo_logo-b40bf595603dc0e63a5c._o2crmd",
      width: 450,
      height: 120,
    },
    {
      publicId: "rapido-bike-taxi8263_wyqpbx",
      width: 866,
      height: 650,
    },
    {
      publicId: "pizza-hut-new6371_mrll4s",
      width: 866,
      height: 650,
    },
    {
      publicId: "nissan-new2693.logowik.com_tlel36",
      width: 866,
      height: 650,
    },
    {
      publicId: "mahindra-suv1293_jrofsa",
      width: 866,
      height: 650,
    },
    {
      publicId: "image_30_u28ygo",
      width: 225,
      height: 225,
    },
    {
      publicId: "image_9_s4z6ly",
      width: 225,
      height: 225,
    },
    {
      publicId: "image_6_uh4dga",
      width: 299,
      height: 168,
    },
    {
      publicId: "image_3_taq4st",
      width: 100,
      height: 100,
    },
    {
      publicId: "dribbble_001_2x_jt7cdu",
      width: 800,
      height: 600,
    },
    {
      publicId: "cblogo_pbrlvr",
      width: 511,
      height: 181,
    },
    {
      publicId: "741_nikon_jsnfod",
      width: 866,
      height: 650,
    },
    {
      publicId:
        "vecteezy_puma-logo-black-symbol-with-name-clothes-design-icon_10994431_w1cjbv",
      width: 1920,
      height: 1571,
    },
    {
      publicId: "subway-logo_iqwkad",
      width: 866,
      height: 400,
    },
    {
      publicId: "rapido_idwf5q",
      width: 76,
      height: 32,
    },
    {
      publicId: "angel_one_quri7v",
      width: 384,
      height: 100,
    },
  ],
  misc: {
    placeholder: "",
  },
};

export type ImageAssets = typeof IMAGES;
