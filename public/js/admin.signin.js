const signinSubmit = document.getElementById('signinSubmit');

signinSubmit.addEventListener('click', async (event) => {
  event.preventDefault();
  const userEmail = document.getElementById('emailField').value;
  const userPassword = document.getElementById('passwordField').value;

  if (!userEmail) {
    alert('이메일을 입력해주세요.');
    return;
  }
  if (!userPassword) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  try {
    const response = await fetch(server + '/api/admin/adminSignin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }
    console.log(data);
    // 관리자 권한 확인 절차를 추가합니다.
    // if (!data.isAdmin) {
    //   alert('관리자만 접근 가능합니다.');
    //   return;
    // }

    localStorage.setItem('accessToken', data.accessToken.split(' ')[1]);
    alert('관리자 로그인 성공');
  } catch (err) {
    console.log(err);
    alert('로그인 실패');
    return;
  }

  window.location.href = 'http://localhost:3000/admin/adminMain.html';
});
