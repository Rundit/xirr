import { Payment } from '../src';

type ExpectedResult = number;
export type TestCase = [ExpectedResult, Payment[]];

export const testCases: TestCase[] = [
  [
    606658.0094,
    [
      { date: '2022-01-01', amount: -100_000 },
      { date: '2022-01-20', amount: 200_000 },
    ],
  ],
  [
    1007.8026,
    [
      { date: '2005-06-01', amount: -162000 },
      { date: '2005-07-31', amount: 505000 },
      { date: '2009-06-01', amount: -116000 },
      { date: '2011-06-01', amount: -116000 },
      { date: '2013-07-31', amount: 1825000 },
      { date: '2022-01-15', amount: 8000000 },
      { date: '2022-12-16', amount: 9000000 },
    ],
  ],
  [
    0.1128,
    [
      { date: '2014-02-01', amount: -76_035.63 },
      { date: '2020-02-01', amount: 73_226.01 },
      { date: '2020-04-01', amount: 36_292.58 },
      { date: '2020-05-01', amount: 6_518.2 },
      { date: '2021-09-30', amount: 14_601.93 },
      { date: '2022-06-07', amount: 21_811.67 },
    ],
  ],
  [
    0.018,
    [
      { date: '2021-07-01', amount: -50_000.0 },
      { date: '2022-10-19', amount: -19_995.96 },
      { date: '2022-12-19', amount: 71_385.34 },
    ],
  ],
  [
    0,
    [
      { date: '2018-05-15', amount: -15_696.25 },
      { date: '2018-05-15', amount: -34_324.1 },
      { date: '2019-03-27', amount: -24_990.17 },
      { date: '2019-11-25', amount: -30.67 },
      { date: '2019-11-25', amount: 75_041.19 },
      { date: '2022-10-28', amount: 0 },
    ],
  ],
  [
    1.1616,
    [
      { date: '2020-12-11', amount: -70_000.0 },
      { date: '2022-12-19', amount: 332_640.0 },
    ],
  ],
  [
    -0.0066,
    [
      { date: '2019-04-09', amount: -25_000.0 },
      { date: '2019-04-11', amount: -50_000.0 },
      { date: '2019-04-11', amount: 74_999.09 },
      { date: '2020-10-06', amount: 0.0 },
    ],
  ],
];
