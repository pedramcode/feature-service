import { prisma } from "../../infrastructure/database";
import {
    AlreadyExistsError,
    BadRequestError,
    NotFoundError,
} from "../../shared/errors";

// recursive private function to check if feature get active
async function _canActivate(_key: string): Promise<boolean> {
    // Step 1: Get the feature with its direct dependencies
    const feature = await prisma.feature.findUnique({
        where: { key: _key },
        include: { dependencies: true },
    });

    if (!feature) {
        throw new NotFoundError(`feature "${_key}"`);
    }

    // Step 2: Recursive check function
    async function checkDependencies(
        dependencies: { key: string; isActive: boolean }[],
        visited = new Set<string>(),
    ): Promise<boolean> {
        for (const dep of dependencies) {
            if (visited.has(dep.key)) continue; // Prevent infinite loop in case of accidental cycles
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

    // Step 3: Start recursive check
    return await checkDependencies(feature.dependencies);
}

async function _deactiveDependents(key: string, visited = new Set<string>()) {
    // Step 1: Find the target feature with dependents
    const feature = await prisma.feature.findUnique({
        where: { key },
        include: { dependents: true },
    });

    if (!feature) {
        throw new NotFoundError(`feature "${key}"`);
    }

    // Step 2: Avoid infinite recursion (cycle protection)
    if (visited.has(key)) {
        return;
    }
    visited.add(key);

    // Step 3: Loop through dependents
    for (const dep of feature.dependents) {
        if (dep.isActive) {
            // Deactivate dependent
            await prisma.feature.update({
                where: { id: dep.id },
                data: { isActive: false },
            });

            // Recursively deactivate its dependents
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
