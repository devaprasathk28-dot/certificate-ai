/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: careerrecommendations
 * Interface for CareerRecommendations
 */
export interface CareerRecommendations {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  requiredSkills?: string;
  /** @wixFieldType text */
  averageSalaryRange?: string;
  /** @wixFieldType text */
  jobMarketOutlook?: string;
  /** @wixFieldType image */
  careerImage?: string;
}


/**
 * Collection ID: certificates
 * Interface for Certificates
 */
export interface Certificates {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType url */
  certificateFileUrl?: string;
  /** @wixFieldType image */
  certificatePreviewImage?: string;
  /** @wixFieldType text */
  issuingBody?: string;
  /** @wixFieldType text */
  recipientName?: string;
  /** @wixFieldType date */
  issueDate?: Date | string;
  /** @wixFieldType number */
  verificationScore?: number;
  /** @wixFieldType boolean */
  fraudDetected?: boolean;
  /** @wixFieldType url */
  publicVerificationLink?: string;
}


/**
 * Collection ID: skills
 * Interface for Skills
 */
export interface Skills {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  skillName?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  proficiencyLevel?: string;
  /** @wixFieldType text */
  relatedTools?: string;
  /** @wixFieldType boolean */
  isCoreSkill?: boolean;
}
