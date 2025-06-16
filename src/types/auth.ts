/**
 * Supported social authentication providers
 * Add new providers here to extend throughout the application
 */
export type SocialProvider = "google" | "github";

/**
 * Social login handler function type
 */
export type SocialLoginHandler = (
  provider: SocialProvider
) => void | Promise<void>;
