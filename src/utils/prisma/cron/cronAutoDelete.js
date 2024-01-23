import cron from "node-cron";
import { MeetingsRepository } from "../../../repositories/meetings.repository.js"

const meetingsRepository = new MeetingsRepository();



export const autoDeleteMeetings = async () => {
    cron.schedule('*/5 * * * * *', async () => {
            console.log("스케줄 실행 ----------------");
    const meetings = await meetingsRepository.getAllMeetings();
 
    for (const meeting of meetings) {
      const currentTime = new Date();
      const createdAt = new Date(meeting.createdAt);

      if (currentTime - createdAt >= 5000){
        await meetingsRepository.autoDeleteMeeting(meeting.id);
        console.log(`${meeting.id}번 미팅방 삭제`);
      }
    }
    })
}


// export const autoDeleteMeetings = async () => {
//     console.log("스케줄 실행 ----------------");
//     const meetings = await this.meetingsRepository.getAllMeetings();
    
//     for (const meeting of meetings) {
//       const currentTime = new Date();
//       const createdAt = new Date(meeting.createdAt);

//       if (currentTime - createdAt >= 5000) {
//         await this.meetingsRepository.autoDeleteMeeting(meeting.id, createdAt);
//         console.log(`${meeting.id}번 미팅방 삭제`);
//       }
//     }
//   }



