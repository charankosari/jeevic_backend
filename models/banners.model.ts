import { Schema } from "ottoman";
import { ottoman } from "../config/ottoman";

interface CBanner {
  id: string;
  image: string;
  created_at?: Date;
  updated_at?: Date;
}

interface EBanner {
  id: string;
  image: string;
  created_at?: Date;
  updated_at?: Date;
}
interface MBanner {
  id: string;
  image?: string;
  video?: string;
  text1: string;
  text2?: string;
  buttontext: string;
  linkto: object;
  created_at?: Date;
  updated_at?: Date;
}
interface MediaItem {
  url: string;
  text1: string;
  text2?: string;
  buttontext: string;
  linkto: {
    type: "product" | "subcategory" | "category";
    id: string;
  };
}

interface FeaturedSection {
  id: string;
  videos?: MediaItem[];
  images?: MediaItem[];
  created_at?: Date;
  updated_at?: Date;
}
const CafeBannerSchema = new Schema({
  id: String,
  image: String,
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});
const EcomBannerSchema = new Schema({
  id: String,
  image: String,
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});
const mainBannerSchema = new Schema({
  id: String,
  image: String,
  video: String,
  text1: String,
  text2: String,
  buttontext: String,
  linkto: Object,
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});
const MediaItemSchema = new Schema({
  url: String,
  text1: String,
  text2: String,
  buttontext: String,
  linkto: {
    type: Object,
    properties: {
      type: { type: String, enum: ["product", "subcategory", "category"] },
      id: String,
    },
  },
});
const FeaturedSectionSchema = new Schema({
  id: String,
  videos: { type: [MediaItemSchema] },
  images: { type: [MediaItemSchema] },
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});
CafeBannerSchema.index.findByUserId = { by: "user_id" };
EcomBannerSchema.index.findByUserId = { by: "user_id" };

const MainBanner = ottoman.model<MBanner>("MBanner", mainBannerSchema);
const CafeBanner = ottoman.model<CBanner>("CafeBanner", CafeBannerSchema);
const EcomBanner = ottoman.model<EBanner>("EcomBanner", EcomBannerSchema); // Corrected model name
const FeaturedSectionModel = ottoman.model<FeaturedSection>(
  "FeaturedSection",
  FeaturedSectionSchema
);

export {
  CafeBanner,
  EcomBanner,
  MainBanner,
  FeaturedSectionModel,
  type MBanner,
  type CBanner,
  type EBanner,
  type FeaturedSection,
};
