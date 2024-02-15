const profileSubmit = document.getElementById('profileSubmit');

profileSubmit.addEventListener('click', async (event) => {
  event.preventDefault();
  const userAge = document.getElementById('ageField').value;
  const userHobby = document.getElementById('hobbyField').value;
  const userJob = document.getElementById('jobField').value;
  const userDistrict = document.getElementById('districtField').value;
  const userDescription = document.getElementById('descriptionField').value;

  let userEI = null;
  let userSN = null;
  let userTF = null;
  let userJP = null;
  let userHeight = null;
  let userFigure = null;
  let userWant1 = null;
  let userWant2 = null;
  let userWant3 = null;

  const mbtiECheck = document.getElementById('mbtiECheck');
  const mbtiICheck = document.getElementById('mbtiICheck');
  const mbtiSCheck = document.getElementById('mbtiSCheck');
  const mbtiNCheck = document.getElementById('mbtiNCheck');
  const mbtiTCheck = document.getElementById('mbtiTCheck');
  const mbtiFCheck = document.getElementById('mbtiFCheck');
  const mbtiJCheck = document.getElementById('mbtiJCheck');
  const mbtiPCheck = document.getElementById('mbtiPCheck');

  const heightCheck1 = document.getElementById('heightCheck1');
  const heightCheck2 = document.getElementById('heightCheck2');
  const heightCheck3 = document.getElementById('heightCheck3');
  const heightCheck4 = document.getElementById('heightCheck4');
  const heightCheck5 = document.getElementById('heightCheck5');
  const heightCheck6 = document.getElementById('heightCheck6');

  const figureCheck1 = document.getElementById('figureCheck1');
  const figureCheck2 = document.getElementById('figureCheck2');
  const figureCheck3 = document.getElementById('figureCheck3');
  const figureCheck4 = document.getElementById('figureCheck4');

  const wantCheckAge1 = document.getElementById('wantCheckAge1');
  const wantCheckMBTI1 = document.getElementById('wantCheckMBTI1');
  const wantCheckHeight1 = document.getElementById('wantCheckHeight1');
  const wantCheckFigure1 = document.getElementById('wantCheckFigure1');
  const wantCheckHobby1 = document.getElementById('wantCheckHobby1');
  const wantCheckJob1 = document.getElementById('wantCheckJob1');
  const wantCheckDistrict1 = document.getElementById('wantCheckDistrict1');

  const wantCheckAge2 = document.getElementById('wantCheckAge2');
  const wantCheckMBTI2 = document.getElementById('wantCheckMBTI2');
  const wantCheckHeight2 = document.getElementById('wantCheckHeight2');
  const wantCheckFigure2 = document.getElementById('wantCheckFigure2');
  const wantCheckHobby2 = document.getElementById('wantCheckHobby2');
  const wantCheckJob2 = document.getElementById('wantCheckJob2');
  const wantCheckDistrict2 = document.getElementById('wantCheckDistrict2');

  const wantCheckAge3 = document.getElementById('wantCheckAge3');
  const wantCheckMBTI3 = document.getElementById('wantCheckMBTI3');
  const wantCheckHeight3 = document.getElementById('wantCheckHeight3');
  const wantCheckFigure3 = document.getElementById('wantCheckFigure3');
  const wantCheckHobby3 = document.getElementById('wantCheckHobby3');
  const wantCheckJob3 = document.getElementById('wantCheckJob3');
  const wantCheckDistrict3 = document.getElementById('wantCheckDistrict3');

  if (mbtiECheck.checked) {
    userEI = 'E';
  }
  if (mbtiICheck.checked) {
    userEI = 'I';
  }
  if (mbtiSCheck.checked) {
    userSN = 'S';
  }
  if (mbtiNCheck.checked) {
    userSN = 'N';
  }
  if (mbtiTCheck.checked) {
    userTF = 'T';
  }
  if (mbtiFCheck.checked) {
    userTF = 'F';
  }
  if (mbtiJCheck.checked) {
    userJP = 'J';
  }
  if (mbtiPCheck.checked) {
    userJP = 'P';
  }

  if (heightCheck1.checked) {
    userHeight = 'CASE1';
  }
  if (heightCheck2.checked) {
    userHeight = 'CASE2';
  }
  if (heightCheck3.checked) {
    userHeight = 'CASE3';
  }
  if (heightCheck4.checked) {
    userHeight = 'CASE4';
  }
  if (heightCheck5.checked) {
    userHeight = 'CASE5';
  }
  if (heightCheck6.checked) {
    userHeight = 'CASE6';
  }

  if (figureCheck1.checked) {
    userFigure = 'SLIM';
  }
  if (figureCheck2.checked) {
    userFigure = 'MEDIUM';
  }
  if (figureCheck3.checked) {
    userFigure = 'PLUMP';
  }
  if (figureCheck4.checked) {
    userFigure = 'MUSCULAR';
  }

  if (wantCheckAge1.checked) {
    userWant1 = 'AGE';
  }
  if (wantCheckMBTI1.checked) {
    userWant1 = 'MBTI';
  }
  if (wantCheckHeight1.checked) {
    userWant1 = 'HEIGHT';
  }
  if (wantCheckFigure1.checked) {
    userWant1 = 'FIGURE';
  }
  if (wantCheckHobby1.checked) {
    userWant1 = 'Hobby';
  }
  if (wantCheckJob1.checked) {
    userWant1 = 'JOB';
  }
  if (wantCheckDistrict1.checked) {
    userWant1 = 'DISTRICT';
  }

  if (wantCheckAge2.checked) {
    userWant2 = 'AGE';
  }
  if (wantCheckMBTI2.checked) {
    userWant2 = 'MBTI';
  }
  if (wantCheckHeight2.checked) {
    userWant2 = 'HEIGHT';
  }
  if (wantCheckFigure2.checked) {
    userWant2 = 'FIGURE';
  }
  if (wantCheckHobby2.checked) {
    userWant2 = 'Hobby';
  }
  if (wantCheckJob2.checked) {
    userWant2 = 'JOB';
  }
  if (wantCheckDistrict2.checked) {
    userWant2 = 'DISTRICT';
  }

  if (wantCheckAge3.checked) {
    userWant3 = 'AGE';
  }
  if (wantCheckMBTI3.checked) {
    userWant3 = 'MBTI';
  }
  if (wantCheckHeight3.checked) {
    userWant3 = 'HEIGHT';
  }
  if (wantCheckFigure3.checked) {
    userWant3 = 'FIGURE';
  }
  if (wantCheckHobby3.checked) {
    userWant3 = 'HOBBY';
  }
  if (wantCheckJob3.checked) {
    userWant3 = 'JOB';
  }
  if (wantCheckDistrict3.checked) {
    userWant3 = 'DISTRICT';
  }

  if (!userAge) {
    alert('나이를 입력해주세요.');
    return;
  }
  if (!userEI || !userSN || !userTF || !userJP) {
    alert('MBTI를 선택해주세요.');
    return;
  }
  if (!userHeight) {
    alert('키를 선택해주세요.');
    return;
  }
  if (!userFigure) {
    alert('체형을 선택해주세요.');
    return;
  }
  if (!userHobby) {
    alert('취미를 입력해주세요.');
    return;
  }
  if (!userJob) {
    alert('직업을 입력해주세요.');
    return;
  }
  if (!userDistrict) {
    alert('지역을 입력해주세요.');
    return;
  }
  if (!userDescription) {
    alert('자기소개를 입력해주세요.');
    return;
  }
  if (!userWant1 || !userWant2 || !userWant3) {
    alert('이상형 우선순위를 선택해주세요.');
    return;
  }

  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('/api/user/updateProfile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        age: +userAge,
        mbti: userEI + userSN + userTF + userJP,
        height: userHeight,
        figure: userFigure,
        hobby: userHobby,
        job: userJob,
        district: userDistrict,
        description: userDescription,
        want1: userWant1,
        want2: userWant2,
        want3: userWant3,
      }),
    });

    const data = await response.json();

    alert('프로필 작성 성공');
    location.href = 'index.html';
  } catch (err) {
    console.log(err);
    alert('프로필 작성 실패');
    return;
  }
});
