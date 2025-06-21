enum EthiopiaRegionEnum {
  AddisAbaba = "Addis Ababa",
  Afar = "Afar Region",
  Amhara = "Amhara Region",
  Benishangul = "Benishangul-Gumuz Region",
  DireDawa = "Dire Dawa",
  Gambela = "Gambela Region",
  Harari = "Harar",
  Oromia = "Oromia Region",
  Sidama = "Sidama",
  Somali = "Somali Region",
  SNNPR = "South Ethiopia Regional State",
  SouthWest = "South West Ethiopia Peoples' Region",
  CentralEthiopia = "Central Ethiopia Regional State",
  Tigray = "Tigray",
}
enum EnumRoles {
  SuperAdmin = "SA",
  Sales = "SL",
  Readonly = "RO",
  FleetManager = "FLTM",
  Finance = "FI",
  OperationManager = "OM",
  OperationTeamAssistant = "OTA",
}
enum ApplicableForEnum {
  Recieveable = "RECIEVEABLE",
  Payable = "PAYABLE",
  Both = "BOTH",
}
enum PayableEnums {
  ALL = "ALL",
  REQUESTED = "REQUESTED",
  PAID = "PAID",
  VOIDED = "VOIDED",
  REJECTED = "REJECTED",
  PAYMENT_SENT_TO_BANK = "PAYMENT SENT TO BANK",
  PAYMENT_PRINTED = "PAYMENT POSTED",
}
const enum CampaignStatus {
  DRAFTED = "DRAFT",
  USED = "USED",
  ACTIVE = "ACTIVE",
}
export enum ExpenseStatus {
  CREATED = "CREATED",
  PAYMENT_REQUESTED = "PAYMENT REQUESTED",
  SUMMARY_GENERATED = "SUMMARY GENERATED",
  PAID = "PAID",
  VOIDED = "VOIDED",
  CANCELLED = "CANCELLED",
}
export enum BankAccountType {
  SAVINGS = 'Saving',
  CHECKING = 'Checking',
  BUSINESS = 'Business',
  JOINT = 'Joint'
}
export {
  ApplicableForEnum,
  CampaignStatus,
  EnumRoles,
  EthiopiaRegionEnum,
  PayableEnums
};

