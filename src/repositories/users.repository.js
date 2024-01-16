// import db from "../routes/index.js";
// const { users } = db; // 이거는 왜 있는지 알아보기
/** 프리즈마 다루시는 레포지토리 증조 할머니 */
import { prisma } from "../utils/prisma/index.js";

export class UsersRepository {
  constructor(prisma) {
    // 생성자에서 전달받은 Prisma 클라이언트의 의존성을 주입합니다. 생성자가 왜 나오는지 알아보기.
    this.prisma = prisma;
  }

  findAllUsers = async (id) => {
    // ORM인 Prisma에서 Users 모델의 findUnique 메서드를 사용해 데이터를 요청
    const users = await prisma.users.findMany();

    return users;
  };

  /** 아이디 조회 */
  findUsersById = async (id) => {
    // ORM인 Prisma에서 Users 모델의 findUnique 메서드를 사용해 데이터를 요청
    const users = await prisma.Users.findUnique({
      where: { id: +id }
    });

    return users;
  };

  /** 이메일 조회 */
  findUsersByEmail = async (email) => {
    // ORM인 Prisma에서 Users 모델의 findUnique 메서드를 사용해 데이터를 요청
    const users = await prisma.Users.findUnique({
      //
      where: { email: email }
    });

    return users;
  };

  /** 회원가입 */
  createUser = async (email, hashedPassword) => {
    // ORM인 Prisma에서 Users 모델의 create 메서드를 사용해 데이터를 요청
    const createdUser = await prisma.Users.create({
      //여기에 await 붙어있어야 된다. users.create() 메서드의 실행이 완료되고 나서야 반환값이 createdUser 변수에 할당 됨
      data: {
        email,
        password: hashedPassword
      }
    });
    return createdUser;
  };

  /** 내 정보수정 */
  updateUser = async (id, hashedPassword) => {
    // ORM인 Prisma에서 Users 모델의 update 메서드를 사용해 데이터를 수정
    const updateUser = await prisma.Users.update({
      where: {
        id: +id
      },
      data: {
        password: hashedPassword
      }
    });

    return updateUser;
  };

  /** 회원탈퇴 */
  deleteUser = async (id) => {
    // ORM인 Prisma에서 Users 모델의 delete 메서드를 사용해 데이터를 삭제
    const deleteUser = await prisma.Users.destroy({
      where: {
        id: +id
      }
    });

    return deleteUser;
  };
}
