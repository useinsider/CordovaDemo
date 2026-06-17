import { InsiderAppCardsError } from './InsiderAppCardsError';

/**
 * Represents the textual content of an app card.
 *
 * This model contains the title and description text that is displayed in the app card.
 */
export class InsiderAppCardContent {
  /** Main title text of the app card. */
  title: string;
  /** Description text of the app card. */
  description: string;
  constructor(params: { title: string; description: string });
}

/**
 * Represents an image associated with an app card.
 *
 * This model contains the image URL to be displayed in the app card.
 */
export class InsiderAppCardImage {
  /** URL of the image to be displayed. */
  url: string;
  constructor(params: { url: string });
}

/**
 * Represents an action button within an app card.
 *
 * This model defines a button that can be displayed in an app card, containing text and an
 * associated action that is executed when the button is tapped.
 */
export class InsiderAppCardButton {
  /** Unique identifier for the button. */
  id: string;
  /** Identifier of the app card this button belongs to. */
  appCardId: string;
  /** Display text shown on the button. */
  text: string;
  /** Action to be executed when the button is tapped. */
  action?: InsiderAppCardAction;
  /** Raw data object containing all button properties. */
  get data(): Record<string, unknown>;
  constructor(data: { id: string; appCardId: string; text: string; action?: InsiderAppCardAction });
  /** Handles the button click action. */
  click(): void;
}

/**
 * Action type values for app card actions.
 *
 * - `"deep_link"`: deeplink navigation
 * - `"open_settings"`: open system app settings
 * - `"feedback"`: feedback action
 */
export type InsiderAppCardActionType = "deep_link" | "open_settings" | "feedback"

/**
 * Defines the interface for app card actions.
 *
 * Conforming types represent different actions that can be executed when a user interacts
 * with an app card or button, such as opening a deeplink or navigating to app settings.
 */
export class InsiderAppCardAction {
  /** Type of the action (deeplink, open settings, or feedback). */
  type: InsiderAppCardActionType;
  constructor(params: { actionType: InsiderAppCardActionType });
}

/**
 * Deeplink type values.
 *
 * - `"external"`: external URL
 * - `"internal"`: internal app navigation
 * - `"url_scheme"`: URL scheme
 * - `"unknown"`: unknown type
 */
export type InsiderAppCardDeeplinkType = "external" | "internal" | "url_scheme" | "unknown"

/**
 * Represents a deeplink action that navigates to a specific location in the app or external URL.
 *
 * This action model contains the data needed to construct and execute a deeplink navigation,
 * including key-value pairs that define the deeplink parameters.
 */
export class InsiderAppCardDeeplinkAction extends InsiderAppCardAction {
  /**
   * Gets the deeplink type based on which URL field is present.
   */
  get deeplinkType(): InsiderAppCardDeeplinkType;
  /**
   * Gets the deeplink URL.
   *
   * Returns the URL based on priority: urlScheme > internalBrowserUrl > externalBrowserUrl.
   * Returns null if none of the URL fields are set.
   */
  get url(): string | null;
  /**
   * Gets the parsed JSON data associated with the deeplink action, or null if not available.
   */
  get json(): any | null;
  /**
   * Gets the key-value pairs associated with the deeplink action.
   */
  get keysAndValues(): { key: string; value: string }[] | undefined;
  constructor(params: {
    url_scheme?: string;
    internal_browser_url?: string;
    external_browser_url?: string;
    json?: string;
    key_value?: { key: string; value: string }[];
  });
}

/**
 * Represents an action that opens the app's settings.
 */
export class InsiderAppCardOpenSettingsAction extends InsiderAppCardAction {
  constructor();
}

/**
 * Represents a feedback action.
 */
export class InsiderAppCardFeedbackAction extends InsiderAppCardAction {
  constructor();
}

/**
 * App card type values.
 *
 * - `"message"`: text-based app card
 * - `"image"`: image-based app card
 */
export type InsiderAppCardType = "message" | "image"

/**
 * Represents a single app card.
 *
 * This model contains all the data for an app card, including its content,
 * images, buttons, and associated actions. App cards can be either text-based or image-based.
 */
export class InsiderAppCard {
  /** Unique identifier for the app card. */
  id: string;
  /** Type of the app card (text or image). */
  type: InsiderAppCardType;
  /** Flag indicating whether the app card has been read by the user. */
  isRead: boolean;
  /** Array of images associated with the app card. */
  images?: InsiderAppCardImage[];
  /** Content model containing the title and description of the app card. */
  content?: InsiderAppCardContent;
  /** Array of action buttons that can be displayed with the app card. */
  buttons?: InsiderAppCardButton[];
  /**
   * Action to be executed when the app card is tapped.
   */
  action?: InsiderAppCardAction;
  /** Raw data object containing all app card properties. */
  get data(): Record<string, unknown>;
  constructor(data: {
    id: string;
    type: InsiderAppCardType;
    read: boolean;
    images?: InsiderAppCardImage[];
    content?: InsiderAppCardContent;
    buttons?: InsiderAppCardButton[];
    action?: InsiderAppCardAction;
  });
  /** Marks the app card as read. */
  markAsRead(completion?: (error?: InsiderAppCardsError) => void): void;
  /** Marks the app card as read and returns a promise. */
  markAsRead(): Promise<void>;
  /** Marks the app card as unread. */
  markAsUnread(completion?: (error?: InsiderAppCardsError) => void): void;
  /** Marks the app card as unread and returns a promise. */
  markAsUnread(): Promise<void>;
  /** Views the app card. */
  view(): void;
  /** Handles the app card click action. */
  click(): void;
  /** Deletes the app card. */
  delete(completion?: (error?: InsiderAppCardsError) => void): void;
  /** Deletes the app card and returns a promise. */
  delete(): Promise<void>;
}

/**
 * Represents the campaign response containing all app cards.
 *
 * This model is the root container for app cards data, holding an array of app card models
 * that can be displayed in the app cards UI.
 */
export class InsiderAppCardsCampaignResponse {
  /**
   * Array of app cards.
   *
   * Contains all app cards retrieved, including both read and unread app cards.
   */
  readonly appCards: InsiderAppCard[];
}
