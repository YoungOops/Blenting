import { MeetingsService } from "../services/meetings.service.js";
import cron from 'node-cron';
//import { errorMiddleware } from "../../middlewares/errorMiddleware.js";
export class MeetingsController {
    meetingsService = new MeetingsService();

    static meetingId = 0; // 필요 엾을듯?
    static setTimeoutSetting = 5000;

    // static runCronSchedule = () => {

    //     cron.schedule = ('0-59 * * * * *', async () => {
    //         try {
                
    //         } catch(err) {
    //             console.log(err);
    //         }
    //     })

    // }

    // 채팅방 생성
    createMeeting = async (req, res) => {
        try {
            const newMeeting = await this.meetingsService.createMeeting();

            MeetingsController.meetingId = newMeeting.id;


            // 일정 시간 경과 후 미팅방 삭제 => cron 사용 주기적으로 체크 아하
            // setTimeout(() => {
            //     this.autoDeleteMeeting(newMeeting.id, res);
            // }, MeetingsController.setTimeoutSetting);

            //MeetingsController.runCronSchedule();

            this.autoDeleteMeetingV2(newMeeting.id, newMeeting.createdAt);

            // 랜덤 질문, 지령, 주제 생성
            this.autoCreateQuestion(newMeeting.id);

// 리턴을 안하면 undefined를 반환, 프론트는 응답한 json을 갖고 작업
            /*return*/ res.status(201).json({
                message: `채팅방이 생성 되었습니다. ${MeetingsController.setTimeoutSetting / 1000}초 후 삭제 됩니다.`,
                newMeeting,
                meetingId: MeetingsController.meetingId
            });
            console.log(`${newMeeting.id}번 미팅방 생성`);
        } catch (err) {
            //next(err);
            console.log("에러확인 ", err)
            res.status(500).json({ err: err.message })
        }
    }

    autoDeleteMeetingV2 = (id, createdAt) => {
        cron.schedule('*/5 * * * * *', () =>{
            this.autoDeleteMeeting(id, createdAt);
        })
    }

    // 미팅방 자동 삭제
    autoDeleteMeeting = async (id,createdAt) => {
        //const { id } = req.params;
        try {

            const deleteMeeting = await this.meetingsService.deleteMeeting(id,createdAt);
            console.log(id, "번 미팅방 삭제 완료")

        } catch (err) {
            console.log(err);
        }
    }

    // 질문,지령,주제 생성 (미완)
    autoCreateQuestion = async (id, res) => {
        const meetingType = await this.meetingsService.findMeetingById(id);
        console.log("미팅방 타입 확인 ", meetingType.type)
        if (meetingType.type == 'GROUP') {
            const createQuestion = await this.meetingsService.createQuestion();
            console.log("질문 : ", createQuestion.description)
            return createQuestion;
        }
    }

    // 리스트 조회
    getAllLists = async (req, res, next) => {
        try {
            const { boardId } = req.params;
            const allLists = await this.meetingsService.getAllLists(boardId);
            return res.status(200).json({
                message: '리스트 조회 성공',
                data: allLists,
            });

        } catch (err) {
            next(err);
        }
    }


    //   static async getListById(req, res) {
    //     const { listId } = req.params;
    //     try {
    //       const list = await ListService.getListById(listId);
    //       if (list) {
    //         res.status(200).json(list);
    //       } else {
    //         res.status(404).json({ message: 'List not found' });
    //       }
    //     } catch (error) {
    //       res.status(500).json({ error: error.message });
    //     }
    //   }

    // 리스트 수정
    // updateListName = async (req, res) => {
    //     try {
    //         const { listId } = req.params;
    //         const { listName } = req.body;

    //         if (!listId) res.status(404).json({ message: '리스트가 존재하지 않습니다.' });

    //         if (!listName) res.status(404).json({ message: '수정 할 이름을 입력해주세요.' });

    //         const updatedList = await this.meetingsService.updateListName(listId, listName);
    //         if (updatedList) {
    //             res.status(200).json({
    //                 message: '리스트가 수정되었습니다.',
    //                 data: listName,
    //             });

    //         } else {
    //             res.status(404).json({ message: '리스트를 찾지 못했습니다.' });
    //         }
    //     } catch (err) {
    //         next(err);
    //     }
    // }


    

    // 리스트 삭제
    deleteMeeting = async (req, res) => {
        const { id } = req.params;
        try {

            const deleteMeeting = await this.meetingsService.deleteMeeting(id);
            console.log(id, "번 미팅방 삭제 완료")
            res.status(200).json({
                message: '채팅방 삭제 성공',
                data: deleteMeeting,
            })
        } catch (err) {
            //next(err);
            res.status(500).json({ err: err.message });
        }
    }
}