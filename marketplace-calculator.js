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
    var weekly_rate = (interest_rate / 100) / 52;
    var accumulation_factor = weekly_rate + 1;
    var whatever = Math.pow(accumulation_factor, weeks)
    return loan_amount * ((whatever * (accumulation_factor - 1)) / (whatever - 1))
}

function amount_from_interest_rate(loan_amount, term, interest_rate) {
    var weeks = 52 * (term / 12);
    return calculate_repayment(loan_amount, weeks, interest_rate) * weeks;
}

function calculate_estimate(loan_amount, term, business_state, personal_credit) {
    var interest_rate = lower_rate_matrix[business_state][personal_credit];
    var total_repayment_amount = amount_from_interest_rate(add_fee(loan_amount), term, interest_rate);
    return {"interest_rate"          : interest_rate,
            "monthly_interest_rate"  : interest_rate / 12,
            "total_repayment_amount" : total_repayment_amount,
            "weekly_repayment_amount": total_repayment_amount / 52}
}


/* Sample usage
   Term is in months. Either 3, 6, 9, or 12
   Business state and Personal credit start at 1. So values are either 1, 2, 3, or 4.
   */
// result = calculate_estimate(10000, 12, 3, 3);
// console.debug("interest_rate          : ", result["interest_rate"])
// console.debug("monthly_interest_rate  : ", result["monthly_interest_rate"])
// console.debug("total epayment_amount       : ", result["repayment_amount"])
// console.debug("weekly_repayment_amount: ", result["weekly_repayment_amount"])


accounting.settings.currency.precision = 0;

$(document).ready(function () {
    // on click of the submit button, calculate rates and populate table

    $("#calculateRepayments").click( function() {
        var loan_amount = parseInt($('#loanAmount').val());
        var term_months = parseInt($('input[name=term]:checked').val());
        var repayment_frequency = $('#repaymentFrequency').val();
        var existing_repayment = parseInt($('#existingRepayment').val());

        var rates = { 
        							Low: 
        								{ 
        									business_state: 1,
        									personal_credit: 1
        								},
        							Average:
        								{ business_state: 2,
        									personal_credit: 3
        								},
        							High: 
        								{ business_state: 4,
        									personal_credit: 4
        								}
        						};

        var times_per_year = {
        	week 		: 52,
        	month 	: 12,
        	quarter	: 4
        }

        var no_of_repayments = term_months * times_per_year[repayment_frequency] / 12;

        for(var rate in rates) {

        	var result = calculate_estimate(loan_amount, 
        		term_months, 
        		rates[rate]["business_state"], 
        		rates[rate]["personal_credit"]);

        	$("#rate" + rate).html( result["interest_rate"] + "%");


/*
					TERM (6M)    ... REPAYMENT FREQUENCY (MONTH = 1) .. NO OF REPAYMENTS = 6 *1
					TERM (12M)    ... REPAYMENT FREQUENCY (MONTH = 1) .. NO OF REPAYMENTS = 12 *1
					
					TERM (3M)    ... REPAYMENT FREQUENCY (WEEKLY = (WEEKS PER MONTH = 52/12)) .. NO OF REPAYMENTS = 3 * 52/12 = 13				
					TERM (6M)    ... REPAYMENT FREQUENCY (WEEKLY = (WEEKS PER MONTH = 52/12)) .. NO OF REPAYMENTS = 6 * 52/12 = 26
					TERM (12M)    ... REPAYMENT FREQUENCY (WEEKLY = (WEEKS PER MONTH = 52/12)) .. NO OF REPAYMENTS = 12 * 52/12 = 52
					TERM (18M)    ... REPAYMENT FREQUENCY (WEEKLY = (WEEKS PER MONTH = 52/12)) .. NO OF REPAYMENTS = 18 * 52/12 = 72

					TERM (3M)    ... REPAYMENT FREQUENCY (QUARTLY = (QUARTERS PER MONTH = 4/12)) .. NO OF REPAYMENTS = 3 * 4/12 = 1					
					TERM (6M)    ... REPAYMENT FREQUENCY (QUARTLY = (QUARTERS PER MONTH = 4/12)) .. NO OF REPAYMENTS = 6 * 4/12 = 2
					TERM (12M)    ... REPAYMENT FREQUENCY (QUARTLY = (QUARTERS PER MONTH = 4/12)) .. NO OF REPAYMENTS = 12 * 4/12 = 4
					TERM (18M)    ... REPAYMENT FREQUENCY (QUARTLY = (QUARTERS PER MONTH = 4/12)) .. NO OF REPAYMENTS = 18 * 4/12 = 6


*/
        	var bigstone_repayment = result["total_repayment_amount"] / no_of_repayments;


        	$("#repayment" + rate).html( accounting.formatMoney(bigstone_repayment));

					$("#savings" + rate).html( accounting.formatMoney(existing_repayment - bigstone_repayment));


					var total_existing_repayment = existing_repayment * no_of_repayments;

					console.log("bigstone total repayment: " + result["total_repayment_amount"] );
					console.log("total_existing_repayment: " + total_existing_repayment);

				  $("#savingsTotal" + rate).html( accounting.formatMoney(total_existing_repayment-result["total_repayment_amount"]));


        }

        $('#repaymentFrequencyDsp')
        .html($("#repaymentFrequency option:selected" ).text().toLowerCase())
   

   

        // $('#rateLow').html("hello");

    });

});

