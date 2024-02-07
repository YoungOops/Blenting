import { prisma } from '../utils/prisma/index.js';


export class MembersRepository {

findUserInfo = async(userId) => {

  const user = await prisma.users.findUnique({
    where: {id: +userId},
    select: {
      id: true,
      gender: true,
    },
  })
  return user;
}
 

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
      // 2024 02 02 
      const member = await prisma.members.findFirst({ // findFirst의 where는 각 조건이 OR연산으로 연결되어있음
        where: {                                       // 그래서 조건이 2개 이상일 경우 하나만 만족해도 결과 반환
          meetingId: +meetingId,
          userId: +checkUserId,
        },
        select: {
          id: true,
          meetingId: true,
          userId: true,
          Users: {
            select: {
              gender: true,
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
            select: {
              id: true,
              nickName: true,
              gender: true,
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
    try {
      const member = await prisma.members.delete({

        where: {
          id: +memberId,
        }

      })
    } catch (err) {
      console.error('알고 싶지 않은 에러', err)
    }

  }


}