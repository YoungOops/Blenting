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
    const response = await fetch('/api/auth/signin', {
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

    localStorage.setItem('accessToken', data.accessToken.split(' ')[1]);
    alert('로그인 성공');
  } catch (err) {
    console.log(err);
    alert('로그인 실패');
    return;
  }

  window.location.href = 'index.html';
});
