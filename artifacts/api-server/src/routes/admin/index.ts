import { Router, type IRouter } from "express";
import providersRouter from "./providers";
import categoriesRouter from "./categories";
import scholarshipsRouter from "./scholarships";

const router: IRouter = Router();

router.use(providersRouter);
router.use(categoriesRouter);
router.use(scholarshipsRouter);

export default router;
