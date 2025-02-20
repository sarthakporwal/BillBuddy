require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const saltRound = 10;
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));



require('./db');
const User = require('./model');
const Expense = require('./expense_model');
const profile = require('./profile')
const userExpense = require('./User_Expense_model');
const Shares = require('./model_stocks');
const StockName = require('./stock_model');
const Group = require('./group');
const userGroups = require('./userGroups');
const GroupName = require('./groupName');
const Amount = require('./amount');
const Participant = require('./participant');


// constant for the alert boxes in login and signup errors
var signUp = {
    exist: false,
    match: false
};

var logIn = {
    userExist: false,
    matchCredential: false
};

// get home page
app.get('/', function (req, res) {
    res.render('home');
    
});

// getting signup page
app.get('/signup', function (req, res) {
    let ex = signUp.exist, ma = signUp.match, exC = logIn.userExist, maC = logIn.matchCredential;
    signUp.match = false;
    logIn.userExist = false;
    res.render('temp_signup', { exist: ex, match: ma, existC: exC, matchC: maC });
});

// posting signup data to database
app.post('/signup', function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const cpassword = req.body.cpassword;

    // checking whether current password and the login password matches or not
    if (password === cpassword) {
        // hashing the password using the bcrypt module
        bcrypt.hash(password, saltRound, async function (err, hash) {
            const newUser = new User({
                name: name,
                email: email,
                password: hash
            });
            // finding whether user exist or not
            const data = await User.findOne({ email: email });
            // if doesnot exist
            if (!data) {
                newUser.save();
                res.redirect('/login');
            } else {
                // if exist
                signUp.exist = true;
                res.redirect('/login');
            }
        })
    } else {
        // if confirm password and the password doesnot matches redirecting user once again to signup page
        signUp.match = true;
        res.redirect('/signup');
    }
})

// getting login page
app.get('/login', function (req, res) {
    let ex = signUp.exist, ma = signUp.match, exC = logIn.userExist, maC = logIn.matchCredential;
    logIn.matchCredential = false;
    signUp.exist = false;
    res.render('temp_login', { exist: ex, match: ma, existC: exC, matchC: maC });
});

// posting login logic
app.post('/login', async function (req, res) {
    // finding data
    const data = await User.findOne({ email: req.body.email });
    if (!data) {
        // if not exist then redirecting it to signup page for registration
        logIn.userExist = true;
        res.redirect('/signup');
    } else {
        // else comparing the bcrypt hash code and the password enterred using bcrypt library
        bcrypt.compare(req.body.password, data.password, function (err, result) {
            if (result === true) {
                // if matched then redirecting it to page1 page with name route parameter
                res.redirect('/page1/' + data.name + '/' + data.email);
            } else {
                // if doesnot match then redirecting it to login parameter
                logIn.matchCredential = true;
                res.redirect('/login');
            }
        })
    }
});

// if user trying to access without authentication redirecting them to login route
app.get('/page1', function (req, res) {
    res.redirect('/login');
});

// getting page1
app.get('/page1/:name/:email', async function (req, res) {
    // checking if the user with given route name para exists 
    const data = await User.findOne({ name: req.params.name });
    if (data) {
        // if user exist then rendering page1 
        res.render('page1', { name: req.params.name , email:req.params.email});
    } else {
        // if user doesnot exist then redirecting them to login
        res.redirect('/signup');
    }
});

// redirecting to the addExpense box;
app.get('/addExpense/:name/:email', async function (req, res) {
    // checking if user with given name exist or not
    const users = await User.findOne({name: req.params.name});
    if(!users){
        // if user doesnot exist redirecting it to signup page
        res.redirect('/signup');
    } else {
        // else rendering the add expense page
        const alertBox = alertDialogBox;
        alertDialogBox = 0;
        res.render('addExpense', { alt: alertBox, name: req.params.name, email: users.email });
    }
});

let alertDialogBox = 0
app.post('/addExpense/:name/:email', async function (req, res) {
    // creating a object of Expense type
    const expense = req.body.expense;
    const category = req.body.category;
    const amount = req.body.amount;
    const newExpenses = new Expense({
        expense: expense,
        category: category,
        amount: amount
    });
    // checking whether our User Expense database contain any data of ogiven name
    const data = await userExpense.findOne({ name: req.params.name });
    const tempdata = await User.findOne({name:req.params.name});
    const email = tempdata.email;
    if (!data) {
        // if not then creating a new model with name equal to parameter name and expense as an arrayn containing current obj Expense
        const newExpense = new userExpense({
            name: req.params.name,
            expense: [newExpenses]
        });
        newExpense.save();
    } else {
        // else pushing the new Expense model object into the array of expense
        data.expense.push(newExpenses);
        data.save();
    }
    alertDialogBox = 1;
    res.redirect('/addExpense/' + req.params.name + '/' + req.params.email);

});

app.get('/viewExpense/:name/:email', async function (req, res) {
    // checking whether user exist or not
    let users = await User.findOne({ name: req.params.name });
    if (!users) {
        // if not redirecting it to signup
        res.redirect('/signup');
    } else {
        //checking for the records
        let records = await userExpense.findOne({ name: req.params.name });
        if (records) {
            // if records exist showing it
            res.render('viewExpense', { found: true, record: records.expense, name: req.params.name, email: users.email });
        } else {
            // else showing No record found!!
            res.render('viewExpense', { found: false, record: [], name: req.params.name , email: users.email });
        }
    }
});

// getting the stocks list the user has added
app.get('/stocks/:name/:email', async function (req, res) {
    // checking whether user with given name exist or not redirecting on basis of different conditions
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
        // if user doesnot exist redirecting it to sign up
        res.redirect('/signup');
    } else {
        // if exist then redirecting it to stocks
        const userData = await Shares.findOne({ name: req.params.name });
        if (userData) {
            // if user with name is found in Database then rendering all the stocks
            const stocks = userData.shares
            res.render('stocks', { name: req.params.name, stocks: stocks, email: req.params.email });
        } else {
            // if no user found then rendering the empty stocks array
            res.render('stocks', { name: req.params.name, stocks: [], email: req.params.email });
        }
    }
});

// adding the given stock in the database of the user with the given name parameters
app.post('/stocks/:name/:email', async function (req, res) {
    // creating new stockName model
    const stock = new StockName({
        shares: req.body.newItem
    });
    const data = await Shares.findOne({ name: req.params.name });
    if (!data) {
        const newUser = new Shares({
            name: req.params.name,
            shares: [stock]
        });
        newUser.save();
    } else {
        data.shares.push(stock);
        data.save();
    }
    res.redirect('/stocks/' + req.params.name +'/' + req.params.email);
});

// To Delete the item from the list!!! Feature currently not working
app.post('/delete/:name/:email', async function (req, res) {
    const checkedItem = req.body.checkbox;
    await Shares.updateOne({ name: req.params.name }, { $pull: { shares: { _id: checkedItem } } });
    res.redirect('/stocks/' + req.params.name + '/' + req.params.email);
});

// getting the stats of the stocks
app.get('/stats/:userName/:name/:email', async function (req, res) {
    const tempData = await User.findOne({name:req.params.userName});
    const email = tempData.email;
    // requesting the api
    const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + req.params.name + '.BSE&apikey=' + process.env.APIKEY;
    // const url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&apikey=demo'
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, function (err, result, data) {
        if (err) {
            console.log(err);
        } else if (result.statusCode !== 200) {
            console.log(res.statusCode);
        } else {  
            // console.log(result);
            // getting the data details
            // getting the opening of the day of stocks
            const openVal = Object.entries(data["Time Series (Daily)"]).map(([date, values]) => {
                return {
                    date,
                    open: values["1. open"]
                }
            });
            // getting the closing of the day of stocks
            const closeVal = Object.entries(data["Time Series (Daily)"]).map(([date, values]) => {
                return {
                    date,
                    close: values["4. close"]
                }
            });
            // getting the highest value of stocks
            const highVal = Object.entries(data["Time Series (Daily)"]).map(([date, values]) => {
                return {
                    date,
                    high: values["2. high"]
                }
            });
            // getting the lowest value of stocks
            const lowVal = Object.entries(data["Time Series (Daily)"]).map(([date, values]) => {
                return {
                    date,
                    low: values["3. low"]
                }
            });
            const date = [];
            openVal.forEach(function(stock) {
                const dates = stock.date.split('-')[1];
                date.push(dates);
            });
            // rendering the stats 
            let month = (Number(new Date().getMonth()) + 1).toString();
            if((month / 10) < 1) {
                month = '0' + month;
            }
            res.render('stats', { name: req.params.name, open: openVal, close: closeVal, low: lowVal, high: highVal, date: date, currentMonth: month, userName: req.params.userName, email: req.params.email});
        }
    });
});  

app.get('/expense/:name/:email', async function(req, res) {
    // finding whether the user exist or not
    const user = await User.findOne({name: req.params.name});
    if (!user) {
        // if user doesnot exists redirecting it to signup
        res.redirect('/signup');
    } else {
        // if it does then checking whether user has any groups in its database
        const userGroup = await userGroups.findOne({name: req.params.name});
        if (userGroup) {
            // if it does then rendering the expense page
            if (userGroup.groups.length !== 0) {
                // if there is atleast one group present in user database, rendering this
                res.render('expense', {name: req.params.name, group: userGroup.groups});
            } else {
                // if no group present rendering this to prevent undefined error
                res.render('expense', {name: req.params.name, group: []});
            }
        } else {
            res.render('expense', {name: req.params.name, group: [], email: req.params.email});
        }
    }
});

app.post('/expense/:name/:email', async function(req, res) {
    const gName = req.body.groupName;
    const email = req.body.email;
    const expense = req.body.expense;
    const button = req.body.button;

    if (button === 'create') {
        // if user click create button
        console.log('created');
        // finding if group with given name exist or not
        const groupCheck = await Group.findOne({name: gName});
        if (!groupCheck) {
            // if not then creating new group
            const newParticipant = new Participant({
                name: req.params.name,
            });
            const newExpense = new Amount();
            const newGroup = new Group({
                name: gName,
                participants: [newParticipant],
                amount: [newExpense]
            });
            newGroup.save();
            // saving the group in the user's group database
            const userGroup = await userGroups.findOne({name: req.params.name});
            if (!userGroup) {
                const newGroupName = new GroupName({
                    name: gName
                });
                const newUserGroup = new userGroups({
                    name: req.params.name,
                    groups: [newGroupName]
                });
                newUserGroup.save();
            } else {
                const newGroup = new GroupName({
                    name: gName
                });
                userGroup.groups.push(newGroup);
                userGroup.save();
            }
            res.redirect('/expense/' + req.params.name + '/' + req.params.email);
        } else {
            // if group exists asking user to join instead of creating
            res.redirect('/expense/' + req.params.name + '/' + req.params.email);
        }
    } else if (button === 'join') {
        console.log('Joined');
        // if user clicks join button
        const groupCheck = await Group.findOne({name: gName});
        if (!groupCheck) {
            // if group doesnot exist asking user to create group first
            res.redirect('/expense/' + req.params.name);
        } else {
            // creating new participants for the group
            const newParticipant = new Participant({
                name: req.params.name
            });
            groupCheck.participants.push(newParticipant);
            groupCheck.save(); 
            // adding group to new participants database
            const userGroup = await userGroups.findOne({name: req.params.name});
            if (!userGroup) {
                const newGroupName = new GroupName({
                    name: gName
                });
                const newUserGroup = new userGroups({
                    name: req.params.name,
                    groups: [newGroupName]
                });
                newUserGroup.save();
            } else {
                // adding group to new participants database
                const newGroup = new GroupName({
                    name: gName
                });
                userGroup.groups.push(newGroup);
                userGroup.save();
            }
            res.redirect('/expense/' + req.params.name);
        }
    } else if (button === 'add') {
        console.log('added');
        // if user click add expense button
        const groupCheck = await Group.findOne({name: gName});
        // checking whether group exist or not
        if (!groupCheck) {
            // if group doesnot exist redirecting it to expense page
            res.redirect('/expense/' + req.params.name);
        } else {
            // saving expense
            const newExpense = new Amount({
                amount: expense
            });
            groupCheck.amount.push(newExpense);
            groupCheck.save();
            res.redirect('/expense/' + req.params.name);
        }
    } else {
        // if user clicks on invite friends link
        console.log('invited');
        const groupCheck = await Group.findOne({name: gName});
        // checking whether group exist or not
        if (!groupCheck) {
            // if group doesnot exist
            res.redirect('/expense/' + req.params.name);
        } else {
            // if group exists
            const user = await User.findOne({email: email});
            if (!user) {
                // if user doesnot exist then alerting user about it and redirecting to expense
                res.redirect('/expense/'+req.params.name);
            } else {
                // saving user to group and group to user 
                const newParticipant = new Participant({
                    name: user.name
                });
                groupCheck.participants.push(newParticipant);
                groupCheck.save();
            }
            const userGroup = await userGroups.findOne({name: user.name});
            if (!userGroup) {
                const newGroupName = new GroupName({
                    name: gName
                });
                const newUserGroup = new userGroups({
                    name: user.name,
                    groups: [newGroupName]
                });
                newUserGroup.save();
            } else {
                const newGroup = new GroupName({
                    name: gName
                });
                userGroup.groups.push(newGroup);
                userGroup.save();
            }
            res.redirect('/expense/' + req.params.name);
        }
    }
});

// to render the graph view 
app.get('/viewGroup/:name/:group/:email', async function(req, res) {
    // checking if user exist or not
    const user = await User.findOne({name: req.params.name});
    if (!user) {
        // if user doesnot exist redirecting it to signup page
        res.redirect('/signup');
    } else {
        // checking group data
        const data = await Group.findOne({name: req.params.group});
        if (data) {
            // if group exists then getting the information and rendering in the viewGroup
            // page
            const people = data.participants;
            const funds = data.amount;

            // all conditions to avoid the error
            if (people.length > 0 && funds.length > 1) {
                let sum = 0;
                for (let i = 1; i < funds.length; i++) {
                    sum += funds[i].amount
                }
                res.render('viewGroup', {name: req.params.group, people: people, funds: sum, email: req.params.email});
            } else if(people.length > 0 && funds.length === 1) {
                res.render('viewGroup', {name: req.params.group, people: people, funds: 0, email: req.params.email});
            } else {
                res.render('viewGroup', {name: req.params.group, people: people, funds: 0, email: req.params.email});
            }
        } else {
            res.redirect('/expense/'+req.params.name);
        }
    }
});


app.post('/profileDash', function(req,res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const phone = req.body.pno;
    const age = req.body.age;
    const income = req.body.income;
    const job= req.body.job;
    const esavings = req.body.esavings;
    const gender = req.body.gender;

    const newProfile = new profile({
        fname:fname,
        lname:lname,
        age:age,
        job:job,
        email:email,
        phone:phone,
        income:income,
        esavings: esavings,
        gender: gender

    });
    newProfile.save();
    res.redirect('/dashboard/' + req.body.fname +'/' + req.body.email)
});

app.get('/dashboard/:name/:email', async function(req,res){
    
    const data = await profile.findOne({email: req.params.email });
    if(!data){
        res.render('profileForm');
    }
    else{
        res.render('dashboard',{fname:data.fname, lname:data.lname, age:data.age, job:data.job, email:data.email, phone:data.phone, income:data.income, esavings:data.esavings, gender:data.gender} );
    }
    
})
 


app.listen(3000, function () {
    console.log('http://localhost:3000/');
});