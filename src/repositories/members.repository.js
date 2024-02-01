import { prisma } from '../utils/prisma/index.js';


export class MembersRepository {

  // 중복되지 않은 경우에만 맴버에 추가
  createMember = async (meetingId, checkUserId) => {

   const member = await prisma.members.create({
      data: {
        meetingId: +meetingId,
        userId: +checkUserId,
      },
    })
    return member;
  }

  // 현재 미팅방과 유저(나) 찾기 
  existingMember = async (meetingId, checkUserId) => {
    try {

      const member = await prisma.members.findFirst({
        where: {
          meetingId: +meetingId,
          userId: +checkUserId,
        },
        select: {
          id: true,
          meetingId: true,
          userId: true,
          Users: {
            select:{
              nickName: true,
            }
          }
        }
      })

      

      // async 에서 return을 사용하면 해당 값을 가지고 있는 새로운 promise 객체를 생성
      return member;

    } catch (err) {
      console.error("알 수 없는 에러", err);
    }

  }

  getExistingMembers = async (meetingId) => {
    try {

      const member = await prisma.members.findMany({
        where: {
          meetingId: +meetingId,
        },
        select: {
          meetingId: true,
          userId: true,
          Users: {
            select:{
              nickName: true,
            }
          }
        }
      })

      // async 에서 return을 사용하면 해당 값을 가지고 있는 새로운 promise 객체를 생성
      return member;

    } catch (err) {
      console.error("알 수 없는 에러", err);
    }

  }


  deleteMember = async (memberId) => {
    try{
      const member = await prisma.members.delete({

        where: {
          id: +memberId,
        }

      })
    }catch(err){
      console.error('알고 싶지 않은 에러', err)
    }
   
  }


}