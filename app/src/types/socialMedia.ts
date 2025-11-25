import { z } from "zod";
import { SocialMediaSchema } from "../schemas/socialMedia";

export type SocialMedia = z.infer<typeof SocialMediaSchema>;
