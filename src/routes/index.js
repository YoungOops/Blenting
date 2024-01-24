import { Router } from "express";
import { meetingsRouter } from "./meetings.router.js";
import { messagesRouter } from "./messages.router.js";

const apiRouter = Router();


// 블랜팅
// 채팅룸
apiRouter.use("/meetings", meetingsRouter);

// 메세지
apiRouter.use("/messages", messagesRouter);

export { apiRouter };
