import { prisma } from '../utils/prisma/index.js';


export class MembersRepository {

  // 중복되지 않은 경우에만 맴버에 추가
  createMember = async (meetingId, checkUserId) => {

    await prisma.members.create({
      data: {
        meetingId: +meetingId,
        userId: +checkUserId,
      },
    })

  }

  // 현재 미팅방과 유저(나) 찾기 
  existingMember = async (meetingId, checkUserId) => {
    const member = await prisma.members.findFirst({
      where: {
        meetingId: +meetingId,
        userId: +checkUserId,
      }
    })

    // async 에서 return을 사용하면 해당 값을 가지고 있는 새로운 promise 객체를 생성
    return member;
  }
}