import { Router } from "express";
import {
    featureCreateController,
    featureActiveController,
    featureDeactiveController,
    featureGetAllController,
} from "../controllers/feature.controller";

const router = Router();

router.post("/", featureCreateController);
router.get("/", featureGetAllController);
router.put("/on/:key", featureActiveController);
router.put("/off/:key", featureDeactiveController);

export default router;
