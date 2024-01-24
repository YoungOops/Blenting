import { autoDeleteMeetings } from "./cronAutoDelete.js";

export const startCron =() => {
    autoDeleteMeetings();
}