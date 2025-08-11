import { Router } from "express";
import { featureCreateController } from "../controllers/feature.controller";

const router = Router();

router.post("/", featureCreateController);

export default router;
