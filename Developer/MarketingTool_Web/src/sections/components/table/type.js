export let Roles;

(function (Roles) {
  Roles['SUPER_ADMIN'] = 'Super Admin';
  Roles['ADMIN'] = 'Admin';
  Roles['ENGINEER'] = 'Engineer';
  Roles['DEVELOPER'] = 'Developer';
})(Roles || (Roles = {}));

export let Status;

(function (Status) {
  Status['ACTIVE'] = 'Active';
  Status['PENDING'] = 'Pending';
  Status['REPORTED'] = 'Reported';
  Status['BLOCKED'] = 'Blocked';
})(Status || (Status = {}));

export let Plans;

(function (Plans) {
  Plans['FREE'] = 'Free';
  Plans['BASIC'] = 'Basic';
  Plans['STARTER'] = 'Starter';
  Plans['ENTERPRISE'] = 'Enterprise';
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
