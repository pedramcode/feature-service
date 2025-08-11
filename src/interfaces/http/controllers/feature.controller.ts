import { Request, Response } from "express";
import { FeatureCreateDTO } from "../dto/feature.dto";
import { BadRequestError } from "../../../shared/errors";
import FeatureService from "../../../application/services/feature.service";
import config from "../../../infrastructure/config";

export const featureCreateController = async (req: Request, res: Response) => {
    const content = FeatureCreateDTO.safeParse(req.body);
    if (content.error) {
        if (config.RUNTIME == "dev") {
            throw new BadRequestError(`invalid data format: ${content.error}`);
        } else {
            throw new BadRequestError("invalid data format");
        }
    }
    const data = content.data!;
    const feature = await FeatureService.create(
        data.key,
        data.desc,
        data.dependencyKeys,
    );
    return res.status(201).send(feature);
};

export const featureActiveController = async (req: Request, res: Response) => {
    const key = req.params["key"];
    await FeatureService.active(key);
    return res.status(200).send({ message: "feature activated" });
};

export const featureDeactiveController = async (
    req: Request,
    res: Response,
) => {
    const key = req.params["key"];
    await FeatureService.deactive(key);
    return res.status(200).send({ message: "feature deactivated" });
};

export const featureGetAllController = async (req: Request, res: Response) => {
    const all = await FeatureService.getAll();
    return res.status(200).send(all);
};
