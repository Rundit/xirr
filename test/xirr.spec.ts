var runditXirr = require('../index')

describe('xirr', () => {
  const xirr = (payments: Payment[]) => runditXirr.compute(payments)

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

  it('gets the same answer even if the transactions are out of order', function() {
    const transactions = []
    transactions.push({ amount: -1000, date: '2010-10-01' })
    transactions.push({ amount: 4300, date: '2011-01-01' })
    transactions.push({ amount: -1000, date: '2010-07-01' })
    transactions.push({ amount: -1000, date: '2010-01-01' })
    transactions.push({ amount: -1000, date: '2010-04-01' })

    const result = xirr(transactions)
    expect( result.toPrecision(6)).toEqual('0.121268')
  })

  it('computes the negative xirr on 1 year decline of 10%', function() {
    const transactions = []
    transactions.push({ amount: -1000, date: '2010-01-01' })
    transactions.push({ amount: 900, date: '2011-01-01' })
    const result = xirr(transactions)
    expect(result.toPrecision(6)).toEqual('-0.100000')
  })
  //
  // it('computes rates of return greater than 100%', function() {
  //   var transactions = []
  //   transactions.push({ amount: -1000, date: '2010,0,1' })
  //   transactions.push({ amount: 3000, date: '2011,0,1' })
  //   var result = xirr(transactions)
  //   assert.equal(2, result.toPrecision(6))
  // })
  //
  // it('computes a rate of return of -100% on a total loss', function() {
  //   var transactions = []
  //   transactions.push({ amount: -1000, date: '2010,0,1' })
  //   transactions.push({ amount: 0, date: '2011,0,1' })
  //   var result = xirr(transactions)
  //   assert.equal(-1, result.toPrecision(6))
  // })
  //
  // it('computes a rate of return of -100% on a total loss', function() {
  //   var transactions = []
  //   transactions.push({ amount: -1000, date: '2010, 0, 1' })
  //   transactions.push({ amount: 0, date: '2012, 0, 1' })
  //   var result = xirr(transactions)
  //   assert.equal(-1, result.toPrecision(6))
  // })
  //
  // it('computes a rate of return of -100% on a total loss', function() {
  //   var transactions = []
  //   transactions.push({ amount: -1000, date: '2010, 0, 1' })
  //   transactions.push({ amount: 0, date: '2010, 7, 1' })
  //   var result = xirr(transactions)
  //   assert.equal(-1, result.toPrecision(6))
  // })
  //
  // it('does not error out on this data set (see issue #1)', function() {
  //   var transactions = []
  //   transactions.push({ amount: -10000, date: ''2000-05-24T00:00:00.000Z'' })
  //   transactions.push({ amount: 3027.25, date: ''2000-06-05T00:00:00.000Z'' })
  //   transactions.push({ amount: 630.68, date: ''2001-04-09T00:00:00.000Z'' })
  //   transactions.push({ amount: 2018.2, date: ''2004-02-24T00:00:00.000Z'' })
  //   transactions.push({ amount: 1513.62, date: ''2005-03-18T00:00:00.000Z'' })
  //   transactions.push({ amount: 1765.89, date: ''2006-02-15T00:00:00.000Z'' })
  //   transactions.push({ amount: 4036.33, date: ''2007-01-10T00:00:00.000Z'' })
  //   transactions.push({ amount: 4036.33, date: ''2007-11-14T00:00:00.000Z'' })
  //   transactions.push({ amount: 1513.62, date: ''2008-12-17T00:00:00.000Z'' })
  //   transactions.push({ amount: 1513.62, date: ''2010-01-15T00:00:00.000Z'' })
  //   transactions.push({ amount: 2018.16, date: ''2011-01-14T00:00:00.000Z'' })
  //   transactions.push({ amount: 1513.62, date: ''2012-02-03T00:00:00.000Z'' })
  //   transactions.push({ amount: 1009.08, date: ''2013-01-18T00:00:00.000Z'' })
  //   transactions.push({ amount: 1513.62, date: ''2014-01-24T00:00:00.000Z'' })
  //   transactions.push({ amount: 1513.62, date: ''2015-01-30T00:00:00.000Z'' })
  //   transactions.push({ amount: 1765.89, date: ''2016-01-22T00:00:00.000Z'' })
  //   transactions.push({ amount: 1765.89, date: ''2017-01-20T00:00:00.000Z'' })
  //   transactions.push({ amount: 22421.55, date: ''2017-06-05T18:30:00.000Z'' })
  //
  //   var result = xirr(transactions)
  //   assert.equal(0.212686, result.toPrecision(6))
  // })
  //
  // it('does not error out on this data set (see issue #2)', function() {
  //   var transactions = []
  //   transactions.push({ amount: -2839.2, date: ''2018-01-21T16:00:00.000Z'' })
  //   transactions.push({ amount: -207.7, date: ''2018-01-24T16:00:00.000Z'' })
  //   transactions.push({ amount: 2526, date: ''2018-04-26T16:00:00.000Z'' })
  //
  //   var result = xirr(transactions)
  //   assert.equal(-0.514174, result.toPrecision(6))
  // })
  //
  // it('converges for this coronavirus inspired data set (see issue #7)', function() {
  //   var transactions = []
  //   transactions.push({ amount: -713.07, date: '2020, 2, 4' })
  //   transactions.push({ amount: 555.33, date: '2020, 2, 17' })
  //
  //   // With the right guess, the computation will converge
  //   var result = xirr(transactions, { guess: -0.9975 })
  //   assert.equal(-0.999106, result.toPrecision(6))
  // })
  //
  // it('converges for this data set (see issue #14)', function() {
  //   var transactions = []
  //   transactions.push({ amount: -99995, date: '2021, 7, 3)})
  //   transactions.push({ amount: 97642, date: '2021, 7, 9' })
  //
  //   var result = xirr(transactions, {guess: -0.99})
  //   assert.equal(-0.765099, result.toPrecision(6))
  // })
  //
  // it('succeeds even when the N-R algorithm values go into the range (-∞,-1]', function() {
  //   var transactions = []
  //   transactions.push({ amount: -2610, date: ''2001-06-22T16:00:00.000Z'' })
  //   transactions.push({ amount: -2589, date: ''2001-07-03T16:00:00.000Z'' })
  //   transactions.push({ amount: -5110, date: ''2001-07-05T16:00:00.000Z'' })
  //   transactions.push({ amount: -2550, date: ''2001-07-06T16:00:00.000Z'' })
  //   transactions.push({ amount: -5086, date: ''2001-07-09T16:00:00.000Z'' })
  //   transactions.push({ amount: -2561, date: ''2001-07-10T16:00:00.000Z'' })
  //   transactions.push({ amount: -5040, date: ''2001-07-12T16:00:00.000Z'' })
  //   transactions.push({ amount: -2552, date: ''2001-07-13T16:00:00.000Z'' })
  //   transactions.push({ amount: -2530, date: ''2001-07-16T16:00:00.000Z'' })
  //   transactions.push({ amount: -9840, date: ''2001-07-17T16:00:00.000Z'' })
  //   transactions.push({ amount: 38900, date: ''2001-07-18T16:00:00.000Z'' })
  //
  //   var result = xirr(transactions)
  //   assert.equal(-0.835340, result.toPrecision(6))
  // })
  //
  // it('does not error out on lots of data', function() {
  //   var transactions = []
  //   var cnt = 120
  //   for (var i=0 i<cnt i++) {
  //     transactions.push({ amount: -1000, date: '2010+(i/12),i%12,1' })
  //   }
  //   transactions.push({ amount: cnt*1000*1.5, date: '2020,0,1' })
  //   var result = xirr(transactions)
  //   assert.equal(0.0785780, result.toPrecision(6))
  // })
  //
  // it('takes guess as option', function() {
  //   var transactions = []
  //   transactions.push({ amount: -1000, date: '2010,0,1' })
  //   transactions.push({ amount: 1100, date: '2011,0,1' })
  //   var result = xirr(transactions,  { guess: 0.1 } )
  //   assert.equal(0.100000, result.toPrecision(6))
  // })
})