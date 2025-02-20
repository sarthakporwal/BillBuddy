const dates = document.querySelectorAll('.dates');
const date = [];
for (let i = 0; i < dates.length; i++) {
  date.push(dates[i].innerText);
}
console.log(date);
const closingPrice = [];
const closingPrices = document.querySelectorAll('.closingPrice');
for (let i = 0; i < closingPrices.length; i++) {
  closingPrice.push(closingPrices[i].innerText);
}
console.log(closingPrice);

const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: date,
      datasets: [{
        label: 'Closing Prices daily',
        data: closingPrice,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    },
    options: {
      scales: {
          y: {
              stacked: true
          },
  
      }
  }
  });