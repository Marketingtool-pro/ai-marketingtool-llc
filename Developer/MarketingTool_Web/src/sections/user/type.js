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
