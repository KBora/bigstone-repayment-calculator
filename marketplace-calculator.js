var lower_rate_matrix = 
{1:  {1: 8,
      2: 10.1,
      3: 13.3,
      4: 18.3},
    2: {1: 8.8,
        2: 11.3,
        3: 15.2,
        4: 21.2},
    3: {1: 9.8,
        2: 12.9,
        3: 17.6,
        4: 22.2},
    4: {1: 10.9,
        2: 14.5,
        3: 20,
        4: 24}};

function add_fee(loan_amount) {
    return 1.01 * loan_amount;
}

function calculate_repayment(loan_amount, weeks, interest_rate) {
    weekly_rate = (interest_rate / 100) / 52;
    accumulation_factor = weekly_rate + 1;
    whatever = Math.pow(accumulation_factor, weeks)
    return loan_amount * ((whatever * (accumulation_factor - 1)) / (whatever - 1))
}

function amount_from_interest_rate(loan_amount, term, interest_rate) {
    weeks = 52 * (term / 12);
    return calculate_repayment(loan_amount, weeks, interest_rate) * weeks;
}

function calculate_estimate(loan_amount, term, business_state, personal_credit) {
    interest_rate = lower_rate_matrix[business_state][personal_credit];
    repayment_amount = amount_from_interest_rate(add_fee(loan_amount), term, interest_rate);
    return {"interest_rate"          : interest_rate,
            "monthly_interest_rate"  : interest_rate / 12,
            "repayment_amount"       : repayment_amount,
            "weekly_repayment_amount": repayment_amount / 52 }
}

/* Sample usage
   Term is in months. Either 3, 6, 9, or 12
   Business state and Personal credit start at 1. So values are either 1, 2, 3, or 4.
*/
result = calculate_estimate(10000, 12, 3, 3);
console.debug("interest_rate          : ", result["interest_rate"])
console.debug("monthly_interest_rate  : ", result["monthly_interest_rate"])
console.debug("repayment_amount       : ", result["repayment_amount"])
console.debug("weekly_repayment_amount: ", result["weekly_repayment_amount"])


