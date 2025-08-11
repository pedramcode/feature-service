import { prisma } from "../../infrastructure/db";

export default class FeatureService {
    static async create(
        isActive: boolean,
        key: string,
        desc?: string,
        dependencies?: string[],
    ) {
        const feature = await prisma.feature.create({
            data: {
                key,
                isActive,
                desc,
                dependencies: { connect: dependencies?.map((id) => ({ id })) },
            },
        });

        return feature;
    }
}
