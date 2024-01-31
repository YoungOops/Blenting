const signupSubmit = document.getElementById('signupSubmit');

signupSubmit.addEventListener('click', async (event) => {
  event.preventDefault();
  const userEmail = document.getElementById('emailField').value;
  const userPassword = document.getElementById('passwordField').value;
  const userCheckPassword = document.getElementById('passwordCheckField').value;
  const userNickName = document.getElementById('nickNameField').value;

  let userGender = null;
  const genderCheckMale = document.getElementById('maleCheck');
  const genderCheckFemale = document.getElementById('femaleCheck');

  if (genderCheckMale.checked) {
    userGender = 'MALE';
  }
  if (genderCheckFemale.checked) {
    userGender = 'FEMALE';
  }

  if (!userEmail) {
    alert('이메일을 입력해주세요.');
    return;
  }
  if (!userPassword) {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  if (!userCheckPassword) {
    alert('비밀번호 확인을 입력해주세요.');
    return;
  }
  if (!userNickName) {
    alert('닉네임을 입력해주세요.');
    return;
  }
  if (!userGender) {
    alert('성별을 선택해주세요.');
    return;
  }

  try {
    const response = await fetch(server + '/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
        checkPassword: userCheckPassword,
        nickName: userNickName,
        gender: userGender,
      }),
    });

    const data = await response.json();

    alert('회원가입 성공');
  } catch (err) {
    console.log(err);
    alert('회원가입 실패');
    return;
  }
});
