import { Request, Response } from "express";
import { FeatureCreateDTO } from "../dto/feature.dto";
import { BadRequestError } from "../../../shared/errors";
import FeatureService from "../../../application/services/feature.service";

export const featureCreateController = async (req: Request, res: Response) => {
    const content = FeatureCreateDTO.safeParse(req.body);
    if (!content) {
        throw new BadRequestError("invalid data format");
    }
    const data = content.data!;
    const feature = await FeatureService.create(
        data.isActive,
        data.key,
        data.desc,
        data.dependencies,
    );
    return res.status(201).send(feature);
};
