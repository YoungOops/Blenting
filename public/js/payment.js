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
      console.log(packages);
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
    const packageContent = document.createElement('button');
    packageContent.innerHTML = `
        <div>${packages.packageName}</div>
        <div>${packages.ticketCount}</div>
        <div>${packages.price}</div>`;
  });
}
