var isMatch = require("date-fns/isMatch");
var MAX_ERROR = 1e-10;
var MAX_COMPUTE_WITH_GUESS_ITERATIONS = 50;
function compute(payments) {
    validate(payments);
    var sortedPayments = payments.sort(function (a, b) { return new Date(a.date).valueOf() - new Date(b.date).valueOf(); });
    var rate = computeRate(payments, 0.1);
    var guess = -0.99;
    while (guess < 1.0 && (Number.isNaN(rate) || !Number.isFinite(rate))) {
        rate = computeRate(sortedPayments, guess);
        guess += 0.01;
    }
    return rate;
}
function computeRate(payments, guess) {
    var r = guess;
    var e = 1.0;
    for (var i = 0; i < MAX_COMPUTE_WITH_GUESS_ITERATIONS; i++) {
        if (e <= MAX_ERROR) {
            return r;
        }
        var r1 = r - xirr(payments, r) / dxirr(payments, r);
        e = Math.abs(r1 - r);
        r = r1;
    }
    return Number.NaN;
}
function xirr(payments, rate) {
    var result = 0.0;
    payments.forEach(function (p) {
        var exp = get_exp(p, payments[0]);
        result += p.amount / Math.pow(1.0 + rate, exp);
    });
    return result;
}
function dxirr(payments, rate) {
    var result = 0.0;
    payments.forEach(function (p) {
        var exp = get_exp(p, payments[0]);
        result -= (p.amount * exp) / Math.pow(1.0 + rate, exp + 1.0);
    });
    return result;
}
function validate(payments) {
    var invalidDates = payments.filter(function (p) { return !isMatch(p.date, "yyyy-MM-dd"); });
    if (invalidDates.length) {
        throw Error("Invalid payments: dates should be formatted as YYYY-MM-DD. Invalid dates: ".concat(invalidDates
            .map(function (i) { return i.date; })
            .join(", ")));
    }
    var hasPositive = payments.some(function (p) { return p.amount > 0; });
    var hasNegative = payments.some(function (p) { return p.amount < 0; });
    if (!hasPositive && !hasNegative) {
        throw Error("Invalid payments: needs to have at least on positive and one negative flow");
    }
}
function getDaysBetweenDates(startDate, endDate) {
    var start = new Date(startDate).getTime();
    var end = new Date(endDate).getTime();
    var diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
function get_exp(p, p0) {
    return getDaysBetweenDates(p.date, p0.date) / 365;
}
var payments = [
    // { date: "2022-01-01", amount: -100_000 },
    // { date: "2022-01-20", amount: 200_000 },
    // 100780,26%
    // { date: "2005-06-01", amount: -162000 },
    // { date: "2005-07-31", amount: 505000 },
    // { date: "2009-06-01", amount: -116000 },
    // { date: "2011-06-01", amount: -116000 },
    // { date: "2013-07-31", amount: 1825000 },
    // { date: "2022-01-15", amount: 8000000 },
    // { date: "2022-12-16", amount: 9000000 },
    // 11,28 %
    // { date: "2014-32-01", amount: -76_035.63 },
    // { date: "2020-02-01", amount: 73_226.01 },
    // { date: "2020-04-01", amount: 36_292.58 },
    // { date: "2020-05-01", amount: 6_518.2 },
    // { date: "2021-09-30", amount: 14_601.93 },
    // { date: "2022-06-07", amount: 21_811.67 },
    // 1,80 %
    // { date: "2021-07-01", amount: -50_000.0 },
    // { date: "2022-10-19", amount: -19_995.96 },
    // { date: "2022-12-19", amount: 71_385.34 },
    // 0,00 % ???
    // { date: "2018-05-15", amount: -15_696.25 },
    // { date: "2018-05-15", amount: -34_324.1 },
    // { date: "2019-03-27", amount: -24_990.17 },
    // { date: "2019-11-25", amount: -30.67 },
    // { date: "2019-11-25", amount: 75_041.19 },
    // { date: "2022-10-28", amount: 0 },
    // 116,16 %
    { date: "2020-12-11", amount: -70000 },
    { date: "2022-12-19", amount: 332640 },
];
// const result = compute(payments);
// console.log({ result });
module.exports = { compute: compute };
