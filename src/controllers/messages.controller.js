import { MessagesService } from "../services/messages.service.js";
import { MessagesRepository } from "../repositories/messages.repository.js";
//import { errorMiddleware } from "../../middlewares/errorMiddleware.js";
export class MessagesController {
    messagesService = new MessagesService();
    messagesRepository = new MessagesRepository();

    // 메세지 생성
    createMessage = async (req, res) => {
        const { meeting_id } = req.params;
        const { description } = req.body;
        try {
            console.log("id 확인", meeting_id);
            const existMeeting = await this.messagesRepository.findMeetingById(meeting_id);
            if (!existMeeting) res.status(500).json({ message: "채팅방이 없습니다" });

            const newMessage = await this.messagesService.createMessage(meeting_id, description);

            return res.status(201).json({
                message: '메세지 생성',
                newMessage
            });
        } catch (err) {
            //next(err);
            console.log("에러체크 :", err)
            res.status(500).json({ err: err.message })
        }
    }

    // 메세지 조회
    getAllLists = async (req, res, next) => {
        try {
            const { boardId } = req.params;
            const allLists = await this.messagesService.getAllLists(boardId);
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
    updateListName = async (req, res) => {
        try {
            const { listId } = req.params;
            const { listName } = req.body;

            if (!listId) res.status(404).json({ message: '리스트가 존재하지 않습니다.' });

            if (!listName) res.status(404).json({ message: '수정 할 이름을 입력해주세요.' });

            const updatedList = await this.messagesService.updateListName(listId, listName);
            if (updatedList) {
                res.status(200).json({
                    message: '리스트가 수정되었습니다.',
                    data: listName,
                });

            } else {
                res.status(404).json({ message: '리스트를 찾지 못했습니다.' });
            }
        } catch (err) {
            next(err);
        }
    }


    // 메세지 삭제
    deleteMeeting = async (req, res) => {
        const { id } = req.params;
        try {

            const deleteMeeting = await this.messagesService.deleteMeeting(id);

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