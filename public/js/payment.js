document.addEventListener('DOMContentLoaded', function () {
  packages();
});

function packages() {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.error('Access token is not found in localStorage');
    return;
  }

  fetch('/api/payment/packageList', {
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
    packageContent.classList.add('custom-btn');
    packageContent.classList.add('btn');
    packageContent.innerHTML = `
      <span>
        <div class="ticket-btn">
          <img style="display: inline;" src="./img/ticket${packages.ticketCount}.jpg" alt="" class="ticket-img" />
          <div style="display: inline;"> 티켓 ${packages.ticketCount}장 </div>
          <div style="display: inline;">
            <div style="display: inline; text-decoration: line-through; color: gray">${packages.price}&#8361</div>
            -> 0&#8361
          </div>
        </div>
      </span>
      `;
    packageContent.addEventListener('click', () => {
      buySubmit(packages.id);
    });
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
  fetch('/api/payment/buyPackage', {
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
