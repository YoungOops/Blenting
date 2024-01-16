//에러핸들링 어떤 방식으로 가져다가 이렇게 한방에 싸잡아서 할 수 있는 건지 알아보기

export default function (err, req, res, next) {
  switch (err.message) {
    // 공통
    case "InvalidParamsError":
      return res.status(400).json({
        errorMessage: "입력 값을 확인해주세요"
      });

    // user, auth router
    case "NotEmail":
      return res.status(400).send({
        errorMessage: "이메일형식이 잘못되었습니다."
      });
    case "NotSamePasswords":
      return res.status(400).json({
        errorMessage: "비밀번호와 비밀번호 확인이 다릅니다."
      });
    case "AlreadyExistEmail":
      return res.status(400).json({
        errorMessage: "이미 존재하는 이메일입니다."
      });
    case "NoExistedUser":
      return res.status(404).json({
        errorMessage: "사용자가 존재하지 않습니다."
      });
    case "NotCorrectPassword":
      return res.status(400).json({
        errorMessage: "비밀번호가 틀립니다."
      });
    case "TokenTypeError":
    case "NotExistToken":
      return res.status(401).send({
        errorMessage: "로그인을 해주세요!"
      });

    // product router
    case "NoProduct":
      return res.status(404).json({
        errorMessage: "상품이 존재하지 않습니다."
      });
    case "Forbidden":
      return res.status(403).send({
        errorMessage: "권한이 없습니다."
      });
    default:
      console.log(err);
      return res.status(500).send({
        errorMessage: "서버터짐"
      });
  }
}
