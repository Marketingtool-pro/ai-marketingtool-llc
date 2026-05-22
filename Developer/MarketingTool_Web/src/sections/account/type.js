export let Plans;

(function (Plans) {
  Plans['STARTER'] = 'Starter';
  Plans['PROFESSIONAL'] = 'Professional';
  Plans['ALL_TOOLS'] = 'All Tools';
})(Plans || (Plans = {}));

export let BillingStatus;

(function (BillingStatus) {
  BillingStatus['PAID'] = 'Paid';
  BillingStatus['SCHEDULED'] = 'Scheduled';
})(BillingStatus || (BillingStatus = {}));

export let BillingCycle;

(function (BillingCycle) {
  BillingCycle['MONTHLY'] = 'Monthly';
  BillingCycle['YEARLY'] = 'Yearly';
})(BillingCycle || (BillingCycle = {}));
