import { prisma } from "../../infrastructure/database";
import {
    AlreadyExistsError,
    BadRequestError,
    NotFoundError,
} from "../../shared/errors";

// recursive private function to check if feature get active
async function _canActivate(_key: string): Promise<boolean> {
    const feature = await prisma.feature.findUnique({
        where: { key: _key },
        include: { dependencies: true },
    });

    if (!feature) {
        throw new NotFoundError(`feature "${_key}"`);
    }

    async function checkDependencies(
        dependencies: { key: string; isActive: boolean }[],
        visited = new Set<string>(),
    ): Promise<boolean> {
        for (const dep of dependencies) {
            if (visited.has(dep.key)) continue;
            visited.add(dep.key);

            if (!dep.isActive) return false;

            const depFeature = await prisma.feature.findUnique({
                where: { key: dep.key },
                include: { dependencies: true },
            });

            if (!depFeature) continue;

            if (!(await checkDependencies(depFeature.dependencies, visited))) {
                return false;
            }
        }
        return true;
    }

    return await checkDependencies(feature.dependencies);
}

// recursive deactivation
async function _deactiveDependents(key: string, visited = new Set<string>()) {
    const feature = await prisma.feature.findUnique({
        where: { key },
        include: { dependents: true },
    });

    if (!feature) {
        throw new NotFoundError(`feature "${key}"`);
    }

    if (visited.has(key)) {
        return;
    }
    visited.add(key);

    for (const dep of feature.dependents) {
        if (dep.isActive) {
            await prisma.feature.update({
                where: { id: dep.id },
                data: { isActive: false },
            });

            await _deactiveDependents(dep.key, visited);
        }
    }
}

export default class FeatureService {
    static async active(key: string) {
        if ((await prisma.feature.count({ where: { key } })) == 0) {
            throw new NotFoundError(`feature "${key}"`);
        }

        if (!(await _canActivate(key))) {
            throw new BadRequestError(
                `Feature "${key}" has some deactivated dependencies`,
            );
        }

        await prisma.feature.update({
            where: { key },
            data: { isActive: true },
        });
    }

    static async deactive(key: string) {
        if ((await prisma.feature.count({ where: { key } })) == 0) {
            throw new NotFoundError(`feature "${key}"`);
        }

        await prisma.feature.update({
            where: { key },
            data: { isActive: false },
        });
        _deactiveDependents(key);
    }

    static async getAll() {
        return await prisma.feature.findMany();
    }

    static async create(key: string, desc?: string, dependencyKeys?: string[]) {
        // Validate dependency states
        if (dependencyKeys) {
            const deps = await prisma.feature.findMany({
                where: { key: { in: dependencyKeys } },
            });
            if (!deps || deps.length == 0) {
                throw new NotFoundError("dependency feature(s)");
            }
        }
        if ((await prisma.feature.count({ where: { key } })) != 0) {
            throw new AlreadyExistsError(`feature with key ${key}`);
        }
        const feature = await prisma.feature.create({
            data: {
                key,
                isActive: false,
                desc,
                dependencies: {
                    connect: dependencyKeys?.map((key) => ({ key })),
                },
            },
            include: {
                dependencies: true,
            },
        });

        return feature;
    }
}
