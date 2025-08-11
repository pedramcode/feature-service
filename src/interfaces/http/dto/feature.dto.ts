import * as z from "zod";

export const FeatureCreateDTO = z.object({
    key: z.string().max(32),
    desc: z.string().max(64).optional(),
    dependencyKeys: z.array(z.string().max(64)).optional(),
});
export type FeatureCreateDTOType = z.infer<typeof FeatureCreateDTO>;
