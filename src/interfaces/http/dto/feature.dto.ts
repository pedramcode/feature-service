import * as z from "zod";

export const FeatureCreateDTO = z.object({
    isActive: z.boolean(),
    key: z.string().max(32),
    desc: z.string().max(64).optional(),
    dependencies: z.array(z.string().max(32)).optional(),
});
export type FeatureCreateDTOType = z.infer<typeof FeatureCreateDTO>;
