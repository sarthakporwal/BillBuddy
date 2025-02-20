const ctx = document.getElementById('myChart');
const amount = document.getElementsByClassName('amount')
const amounts = [];
for (let i = 0; i < amount.length; i++) {
    const dataSet1 = amount[i].innerHTML.replace('\n', ''); 
    const dataSet2 = dataSet1.replace('\n', ''); 
    amounts.push(dataSet2.trim());
}
console.log(amounts);

const category = document.getElementsByClassName('category');
const categories = [];
for(let i = 0; i < category.length; i++) {
    const dataSet1 = category[i].innerHTML.replace('\n', ''); 
    const dataSet2 = dataSet1.replace('\n', ''); 
    categories.push(dataSet2.trim());
}
console.log(categories);

let food = 0,family = 0, friends = 0, shopping = 0, others = 0;
for(let i = 0; i < categories.length; i++) {
    if (categories[i] === 'Family') {
        family += Number(amounts[i])
    } else if(categories[i] === 'Friends') {
        friends += Number(amounts[i]);
    } else if(categories[i] === 'Shopping') {
        shopping += Number(amounts[i]); 
    } else if(categories[i] === 'Food') {
        food += Number(amounts[i]);
    } else {
        others += Number(amounts[i]);
    }
}
let graphData = [food, family, friends, shopping, others];
new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Food', 'Family', 'Friends', 'Shopping', 'Other'],
        datasets: [{
            data: graphData,
            borderWidth: 1
        }]
    }
});