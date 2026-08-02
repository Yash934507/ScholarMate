import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scholarshipsRouter from "./scholarships";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scholarshipsRouter);
router.use(adminRouter);

export default router;
