import { Router } from "express";

import featureRouter from "./feature.route";

const router = Router();

router.use("/feature", featureRouter);

export default router;
