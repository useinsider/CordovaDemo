import {
  InsiderAppCardsCampaignResponse,
  InsiderAppCard,
  InsiderAppCardButton,
} from './InsiderAppCard';
import { InsiderAppCardsError } from './InsiderAppCardsError';

/**
 * Main API for accessing and managing app cards functionality.
 *
 * This interface provides methods to retrieve app cards and notifications
 * from the Insider platform. App cards can contain text, images, and
 * interactive buttons.
 *
 * The app cards allows you to:
 * - Fetch app cards with their content and metadata
 * - Access app card read/unread status
 * - Handle interactive buttons within app cards
 * - Support multiple content types (text, images)
 */
export interface InsiderAppCards {
  /**
   * Retrieves the user's app cards campaigns.
   *
   * Fetches all available app cards from the Insider platform for the current user.
   * This method cancels any pending requests before initiating a new one.
   *
   * The response contains app cards that may include:
   * - Marketing notifications and promotional content
   * - Multi-media content (text, images)
   * - Interactive buttons with associated actions
   * - Read/unread status for each app card
   *
   * @param completion - A completion handler called when the campaigns are retrieved or an error occurs.
   * The completion handler takes two parameters:
   * - error: An InsiderAppCardsError if the request fails, null otherwise.
   * - response: An InsiderAppCardsCampaignResponse containing the user's app cards. Will be null if an error occurred.
   *
   * @example
   * ```typescript
   * Insider.appCards.getCampaigns((error, response) => {
   *   if (error) {
   *     console.log('Failed:', error.code, error.message);
   *   } else {
   *     response.appCards.forEach(appCard => {
   *       console.log('App Card ID:', appCard.id, 'Read:', appCard.isRead);
   *     });
   *   }
   * });
   * ```
   */
  getCampaigns(
    completion: (
      error?: InsiderAppCardsError,
      response?: InsiderAppCardsCampaignResponse
    ) => void
  ): void;

  /**
   * Retrieves the user's app cards campaigns and returns a promise.
   *
   * Fetches all available app cards from the Insider platform for the current user.
   * This method cancels any pending requests before initiating a new one.
   *
   * @returns A Promise that resolves with the campaign response or rejects with an error.
   *
   * @example
   * ```typescript
   * try {
   *   const response = await Insider.appCards.getCampaigns();
   *   response.appCards.forEach(appCard => {
   *     console.log('App Card ID:', appCard.id, 'Read:', appCard.isRead);
   *   });
   * } catch (error) {
   *   console.log('Failed to fetch app cards:', error.message);
   * }
   * ```
   */
  getCampaigns(): Promise<InsiderAppCardsCampaignResponse>;

  /**
   * Marks specified app cards as read.
   *
   * Updates the read status of one or more app cards to indicate they have been viewed by the user.
   * This operation synchronizes with the Insider backend to persist the read state across devices.
   *
   * @param appCardIds - An array of app card identifiers to mark as read. Each ID should correspond to a valid
   * app card ID. Empty arrays are allowed but will result in no operation.
   * @param completion - A completion handler called when the operation finishes.
   * The completion handler takes one parameter:
   * - error: An error object if the request fails, undefined if successful.
   *
   * @example
   * ```typescript
   * Insider.appCards.markAsRead(['msg_123', 'msg_456'], (error) => {
   *   if (error) {
   *     console.log('Failed to mark app cards as read:', error.message);
   *   } else {
   *     console.log('App cards marked as read successfully');
   *   }
   * });
   * ```
   *
   * @remarks App card IDs that don't exist are silently ignored.
   * @remarks This method will be implemented in a future release.
   */
  markAsRead(
    appCardIds: string[],
    completion: (error?: InsiderAppCardsError) => void
  ): void;

  /**
   * Marks specified app cards as read and returns a promise.
   *
   * Updates the read status of one or more app cards to indicate they have been viewed by the user.
   * This operation synchronizes with the Insider backend to persist the read state across devices.
   *
   * @param appCardIds - An array of app card identifiers to mark as read. Each ID should correspond to a valid
   * app card ID. Empty arrays are allowed but will result in no operation.
   * @returns A Promise that resolves when successful or rejects with an error.
   *
   * @example
   * ```typescript
   * try {
   *   await Insider.appCards.markAsRead(['msg_123', 'msg_456']);
   *   console.log('App cards marked as read successfully');
   * } catch (error) {
   *   console.log('Failed to mark app cards as read:', error.message);
   * }
   * ```
   *
   * @remarks App card IDs that don't exist are silently ignored.
   * @remarks This method will be implemented in a future release.
   */
  markAsRead(appCardIds: string[]): Promise<void>;

  /**
   * Marks specified app cards as unread.
   *
   * Updates the read status of one or more app cards to indicate they are unread.
   * This operation synchronizes with the Insider backend to persist the unread state across devices.
   *
   * @param appCardIds - An array of app card identifiers to mark as unread. Each ID should correspond to a valid
   * app card ID. Empty arrays are allowed but will result in no operation.
   * @param completion - A completion handler called when the operation finishes.
   * The completion handler takes one parameter:
   * - error: An error object if the request fails, undefined if successful.
   *
   * @example
   * ```typescript
   * Insider.appCards.markAsUnread(['msg_123', 'msg_456'], (error) => {
   *   if (error) {
   *     console.log('Failed to mark app cards as unread:', error.message);
   *   } else {
   *     console.log('App cards marked as unread successfully');
   *   }
   * });
   * ```
   *
   * @remarks App card IDs that don't exist are silently ignored.
   * @remarks This method will be implemented in a future release.
   */
  markAsUnread(
    appCardIds: string[],
    completion: (error?: InsiderAppCardsError) => void
  ): void;

  /**
   * Marks specified app cards as unread and returns a promise.
   *
   * Updates the read status of one or more app cards to indicate they are unread.
   * This operation synchronizes with the Insider backend to persist the unread state across devices.
   *
   * @param appCardIds - An array of app card identifiers to mark as unread. Each ID should correspond to a valid
   * app card ID. Empty arrays are allowed but will result in no operation.
   * @returns A Promise that resolves when successful or rejects with an error.
   *
   * @example
   * ```typescript
   * try {
   *   await Insider.appCards.markAsUnread(['msg_123', 'msg_456']);
   *   console.log('App cards marked as unread successfully');
   * } catch (error) {
   *   console.log('Failed to mark app cards as unread:', error.message);
   * }
   * ```
   *
   * @remarks App card IDs that don't exist are silently ignored.
   * @remarks This method will be implemented in a future release.
   */
  markAsUnread(appCardIds: string[]): Promise<void>;

  /**
   * Records a view event for an app card.
   *
   * Call this method when a user views an app card.
   * This notifies observers and can be used for analytics tracking.
   *
   * @param appCard - The app card that was viewed.
   *
   * @example
   * ```typescript
   * Insider.appCards.view(appCard);
   * ```
   *
   * @remarks This method will be implemented in a future release.
   */
  view(appCard: InsiderAppCard): void;

  /**
   * Records a click event for an app card.
   *
   * Call this method when a user clicks or taps on an app card.
   * This executes the app card's deeplink action (if present) and notifies observers.
   *
   * @param appCard - The app card that was clicked.
   *
   * @example
   * ```typescript
   * Insider.appCards.click(appCard);
   * ```
   *
   * @remarks This method will be implemented in a future release.
   */
  click(appCard: InsiderAppCard): void;

  /**
   * Records a click event for a button within an app card.
   *
   * Call this method when a user clicks or taps on a button in an app card.
   * This executes the button's action (if present) and notifies observers.
   *
   * @param button - The button that was clicked.
   *
   * @example
   * ```typescript
   * Insider.appCards.clickButton(button);
   * ```
   *
   * @remarks This method will be implemented in a future release.
   */
  clickButton(button: InsiderAppCardButton): void;

  /**
   * Deletes specified app cards.
   *
   * Removes one or more app cards from the user's list.
   * This operation synchronizes with the Insider backend.
   *
   * @param appCardIds - An array of app card identifiers to delete.
   * @param completion - A completion handler called when the operation finishes.
   * The completion handler takes one parameter:
   * - error: An error object if the request fails, undefined if successful.
   *
   * @example
   * ```typescript
   * Insider.appCards.delete(['msg_123', 'msg_456'], (error) => {
   *   if (error) {
   *     console.log('Failed to delete app cards:', error.message);
   *   } else {
   *     console.log('App cards deleted successfully');
   *   }
   * });
   * ```
   */
  delete(appCardIds: string[], completion: (error?: Error) => void): void;

  /**
   * Deletes specified app cards and returns a promise.
   *
   * Removes one or more app cards from the user's list.
   * This operation synchronizes with the Insider backend.
   *
   * @param appCardIds - An array of app card identifiers to delete.
   * @returns A Promise that resolves when successful or rejects with an error.
   *
   * @example
   * ```typescript
   * try {
   *   await Insider.appCards.delete(['msg_123', 'msg_456']);
   *   console.log('App cards deleted successfully');
   * } catch (error) {
   *   console.log('Failed to delete app cards:', error.message);
   * }
   * ```
   */
  delete(appCardIds: string[]): Promise<void>;
}

declare const InsiderAppCards: InsiderAppCards;
export default InsiderAppCards;
