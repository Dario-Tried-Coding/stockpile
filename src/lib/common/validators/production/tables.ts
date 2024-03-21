import { workareas } from "@/config/locations.config";
import { z } from "zod";

export const RawMaterialsTableValidator = z.object({
  workarea: z.enum(workareas).nullish(),
})