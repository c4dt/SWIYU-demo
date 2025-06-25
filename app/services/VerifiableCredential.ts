export interface DiplomaSchema {
  firstName: string;
  lastName: string;
  degree: string;
  birthDate: string;
  dateOfIssue: string;
  betaIdDocumentNumber: string;
  betaIdCnf: string;
}

export interface ActionLog {
  source: string;
  target?: string;
  message: string;
}
