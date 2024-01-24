import { Router } from 'express';
import { MeetingsController } from '../controllers/meetings.controller.js';


const meetingsController = new MeetingsController();

const meetingsRouter = Router();

//생성
meetingsRouter.post('/', meetingsController.createMeeting);


// 조회
//meetingsRouter.get('/', meetingsController.getAllMeetings);



//삭제 (생성 후 30분 후 삭제)
meetingsRouter.delete('/:id', meetingsController.deleteMeeting);


export { meetingsRouter };