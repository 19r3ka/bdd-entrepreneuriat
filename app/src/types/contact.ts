import { z } from "zod";
import { ContactSchema } from "../schemas/contact";

export type Contact = z.infer<typeof ContactSchema>;
