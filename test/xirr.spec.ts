var runditXirr = require('../index')

describe('xirr', () => {
  const xirr = (payments: Payment[], opts?: any) => runditXirr.compute(payments, opts)

  test('calculate explosive returns', () => {
    expect(runditXirr.compute([
      { date: '2005-06-01', amount: -162000 },
      { date: '2005-07-31', amount: 505000 },
      { date: '2009-06-01', amount: -116000 },
      { date: '2011-06-01', amount: -116000 },
      { date: '2013-07-31', amount: 1825000 },
      { date: '2022-01-15', amount: 8000000 },
      { date: '2022-12-16', amount: 9000000 },
    ])).toEqual(1007.8026438395354)
  })


  it('computes the xirr on 1 year growth of 0%', () => {
    const transactions = []
    transactions.push({ amount: -1000, date: '2010-01-01' })
    transactions.push({ amount: 1000, date: '2011-01-01' })
    const result = xirr(transactions)
    expect(result).toBeCloseTo(0)
  })

  it('computes the xirr on 1 year growth of 10%', () => {
    const transactions = []
    transactions.push({ amount: -1000, date: '2010-01-01' })
    transactions.push({ amount: 1100, date: '2011-01-01' })
    const result = xirr(transactions)
    expect(result.toPrecision(6)).toEqual('0.100000')
  })

  it('computes the xirr on a particular data set the same as a popular spreadsheet', () => {
    const transactions = [
      { amount: -1000, date: '2010-01-01' },
      { amount: -1000, date: '2010-04-01' },
      { amount: -1000, date: '2010-07-01' },
      { amount: -1000, date: '2010-10-01' },
      { amount: 4300, date: '2011-01-01' }
    ]
    const result = xirr(transactions)
    expect(result.toPrecision(6)).toEqual('0.121268')
  })

  it('gets the same answer even if the transactions are out of order', function () {
    const transactions = []
    transactions.push({ amount: -1000, date: '2010-10-01' })
    transactions.push({ amount: 4300, date: '2011-01-01' })
    transactions.push({ amount: -1000, date: '2010-07-01' })
    transactions.push({ amount: -1000, date: '2010-01-01' })
    transactions.push({ amount: -1000, date: '2010-04-01' })

    const result = xirr(transactions)
    expect(result.toPrecision(6)).toEqual('0.121268')
  })

  it('computes the negative xirr on 1 year decline of 10%', () => {
    const transactions = []
    transactions.push({ amount: -1000, date: '2010-01-01' })
    transactions.push({ amount: 900, date: '2011-01-01' })
    const result = xirr(transactions)
    expect(result.toPrecision(6)).toEqual('-0.100000')
  })


  it('computes rates of return greater than 100%', () => {
    const transactions = [
      { amount: -1000, date: '2010-01-01' },
      { amount: 3000, date: '2011-01-01' }
    ]
    const result = xirr(transactions)
    expect(result).toBeCloseTo(2)
  })

  it('computes a rate of return of -100% on a total loss', () => {
    const transactions = []
    transactions.push({ amount: -1000, date: '2010-01-01' })
    transactions.push({ amount: 0, date: '2011-01-01' })
    const result = xirr(transactions)
    expect(result).toBeNaN()
  })

  it('computes a rate of return of -100% on a total loss', () => {
    const transactions = [
      { amount: -1000, date: '2010-01-01' },
      { amount: 0, date: '2012-01-01' }
    ]
    const result = xirr(transactions)
    expect(result).toBeNaN()
  })

  it('computes a rate of return of -100% on a total loss', () => {
    const transactions = [
      { amount: -1000, date: '2010-01-01' },
      { amount: 0, date: '2010-08-01' },
    ]
    const result = xirr(transactions)
    expect(result).toBeNaN()
  })


  it('does not error out on this data set', function () {
    const transactions = [
      { amount: -10000, date: '2000-05-24' },
      { amount: 3027.25, date: '2000-06-05' },
      { amount: 630.68, date: '2001-04-09' },
      { amount: 2018.2, date: '2004-02-24' },
      { amount: 1513.62, date: '2005-03-18' },
      { amount: 1765.89, date: '2006-02-15' },
      { amount: 4036.33, date: '2007-01-10' },
      { amount: 4036.33, date: '2007-11-14' },
      { amount: 1513.62, date: '2008-12-17' },
      { amount: 1513.62, date: '2010-01-15' },
      { amount: 2018.16, date: '2011-01-14' },
      { amount: 1513.62, date: '2012-02-03' },
      { amount: 1009.08, date: '2013-01-18' },
      { amount: 1513.62, date: '2014-01-24' },
      { amount: 1513.62, date: '2015-01-30' },
      { amount: 1765.89, date: '2016-01-22' },
      { amount: 1765.89, date: '2017-01-20' },
      { amount: 22421.55, date: '2017-06-05' },
    ]
    const result = xirr(transactions)
    expect(result).toBeCloseTo(0.212686)
  })

  it('does not error out on this data set (see issue #2)', function () {
    const transactions = [
      { amount: -2839.2, date: '2018-01-21' },
      { amount: -207.7, date: '2018-01-24' },
      { amount: 2526, date: '2018-04-26' },
    ]

    const result = xirr(transactions)
    expect(result).toBeCloseTo(-0.514174)
  })

  it.skip('converges for this coronavirus inspired data set', () => {
    const transactions = [
      { amount: -713.07, date: '2020-03-04' },
      { amount: 555.33, date: '2020-03-17' },
    ]
    // With the right guess, the computation will converge
    const result = xirr(transactions, { guess: -0.9975 })
    expect(result).toBeCloseTo(-0.999106)
  })


  it('converges for this data set (see issue #14)', () => {
    const transactions = [
      { amount: -99995, date: '2021-08-03' },
      { amount: 97642, date: '2021-08-09' },
    ]
    const result = xirr(transactions, { guess: -0.99 })
    expect(result).toBeCloseTo(-0.765099)
  })

  it('succeeds even when the N-R algorithm values go into the range (-∞,-1]', () => {
    const transactions = [
      { amount: -2610, date: '2001-06-22' },
      { amount: -2589, date: '2001-07-03' },
      { amount: -5110, date: '2001-07-05' },
      { amount: -2550, date: '2001-07-06' },
      { amount: -5086, date: '2001-07-09' },
      { amount: -2561, date: '2001-07-10' },
      { amount: -5040, date: '2001-07-12' },
      { amount: -2552, date: '2001-07-13' },
      { amount: -2530, date: '2001-07-16' },
      { amount: -9840, date: '2001-07-17' },
      { amount: 38900, date: '2001-07-18' }
    ]

    const result = xirr(transactions)
    expect(result).toBeCloseTo(-0.835340)
  })

  it('takes guess as option', () => {
    const transactions = [
      { amount: -1000, date: '2010-01-01' },
      { amount: 1100, date: '2011-01-01' },
    ]
    const result = xirr(transactions,  { guess: 0.1 } )
    expect(result).toBeCloseTo(0.10)
  })
})