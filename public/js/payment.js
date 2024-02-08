document.addEventListener('DOMContentLoaded', function () {
  packages();
});

function packages() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('Access token is not found in localStorage');
    return;
  }

  fetch(server + '/api/payment/packageList', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((packages) => {
      paymentList(packages);
    })
    .catch((error) => {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
    });
}

function paymentList(data) {
  const paymentContents = document.getElementById('paymentList');
  paymentContents.innerHTML = '';

  data.forEach((packages) => {
    const packageContent = document.createElement('div');
    packageContent.setAttribute('onclick', `buySubmit(${packages.id})`);
    packageContent.style =
      'display: flex; flex-direction: column; align-items: center; justify-content: space-evenly; font-family: sans-serif; font-size: medium; font-weight: 700; outline-color: #e6a4b4; outline-style: solid; margin-top: 20px; margin-bottom: 20px; margin-left: 20%; margin-right: 20%; width: 60%; aspect-ratio: 162/100; min-width: 162px; min-height: 100px; border-radius: 15px; background-color: #fff8e3; border: none; cursor: pointer';
    packageContent.innerHTML = `
        <div>${packages.packageName} 패키지</div>
        <div>티켓 ${packages.ticketCount}장</div>
        <div>
            <span style="text-decoration: line-through; color: gray">${packages.price}&#8361</span>
            <span> -> 0&#8361</span>
        </div>`;
    paymentContents.append(packageContent);
  });
}

function buySubmit(packageId) {
  const token = localStorage.getItem('accessToken');
  console.log(
    JSON.stringify({
      packageId: packageId,
    }),
  );
  fetch(server + '/api/payment/buyPackage', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      packageId: packageId,
    }),
  })
    .then(() => {
      alert('구매 성공');
    })
    .then(() => {
      window.location.href = 'index.html';
    });
}
