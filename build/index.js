"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compute = void 0;
const isMatch_1 = __importDefault(require("date-fns/isMatch"));
const MAX_ERROR = 1e-10;
const MAX_COMPUTE_WITH_GUESS_ITERATIONS = 50;
function compute(payments, options) {
    validate(payments);
    const sortedPayments = payments.sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf());
    let rate = computeRate(payments, 0.1, options === null || options === void 0 ? void 0 : options.maxIterations);
    let guess = (options === null || options === void 0 ? void 0 : options.guess) || -0.99999999;
    while (guess < 1.0 && (Number.isNaN(rate) || !Number.isFinite(rate))) {
        rate = computeRate(sortedPayments, guess);
        guess += 0.01;
    }
    return rate;
}
exports.compute = compute;
function computeRate(payments, guess, maxIterations = MAX_COMPUTE_WITH_GUESS_ITERATIONS) {
    let r = guess;
    let e = 1.0;
    for (let i = 0; i < maxIterations; i++) {
        if (e <= MAX_ERROR) {
            return r;
        }
        const r1 = r - xirr(payments, r) / dxirr(payments, r);
        e = Math.abs(r1 - r);
        r = r1;
    }
    return Number.NaN;
}
function xirr(payments, rate) {
    let result = 0.0;
    payments.forEach((p) => {
        const exp = get_exp(p, payments[0]);
        result += p.amount / Math.pow(1.0 + rate, exp);
    });
    return result;
}
function dxirr(payments, rate) {
    let result = 0.0;
    payments.forEach((p) => {
        const exp = get_exp(p, payments[0]);
        result -= (p.amount * exp) / Math.pow(1.0 + rate, exp + 1.0);
    });
    return result;
}
function validate(payments) {
    const invalidDates = payments.filter((p) => !(0, isMatch_1.default)(p.date, 'yyyy-MM-dd'));
    if (invalidDates.length) {
        throw Error(`Invalid payments: dates should be formatted as YYYY-MM-DD. Invalid dates: ${invalidDates
            .map((i) => i.date)
            .join(', ')}`);
    }
    const hasPositive = payments.some((p) => p.amount > 0);
    const hasNegative = payments.some((p) => p.amount < 0);
    if (!hasPositive && !hasNegative) {
        throw Error('Invalid payments: needs to have at least on positive and one negative flow');
    }
}
function getDaysBetweenDates(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
function get_exp(p, p0) {
    return getDaysBetweenDates(p.date, p0.date) / 365;
}
