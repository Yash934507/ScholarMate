import { Router, type IRouter } from "express";
import healthRouter from "./health";
import scholarshipsRouter from "./scholarships";
import categoriesRouter from "./categories";
import providersRouter from "./providers";
import adminRouter from "./admin";
import studentRouter from "./student";

const router: IRouter = Router();

router.use(healthRouter);
router.use(scholarshipsRouter);
router.use(categoriesRouter);
router.use(providersRouter);
router.use(adminRouter);
router.use(studentRouter);

export default router;
