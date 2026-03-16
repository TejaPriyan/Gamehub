/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: minigames
 * Interface for MiniGames
 */
export interface MiniGames {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  gameTitle?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  thumbnailImage?: string;
  /** @wixFieldType text */
  gameDescription?: string;
  /** @wixFieldType url */
  playLink?: string;
  /** @wixFieldType text */
  genre?: string;
}


/**
 * Collection ID: playercards
 * Interface for PlayerCards
 */
export interface PlayerCards {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType number */
  age?: number;
  /** @wixFieldType text */
  gender?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  avatar?: string;
  /** @wixFieldType text */
  gamerTag?: string;
}
