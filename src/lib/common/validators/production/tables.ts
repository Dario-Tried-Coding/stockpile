import { workareas } from "@/constants/locations";
import { z } from "zod";

export const RawMaterialsTableValidator = z.object({
  workarea: z.enum(workareas).nullish(),
})