import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    uptimeSeconds: Math.round(process.uptime()),
    time: new Date().toISOString(),
  });
});

export default router;