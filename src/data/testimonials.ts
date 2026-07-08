/**
 * Real client testimonials — sourced from the Sitting Sucks LLC Google
 * Business profile (9 reviews, 5.0 stars). Paste verbatim quotes only;
 * never fabricate. The landing section renders only when this is non-empty.
 */

export interface Testimonial {
  quote: string;
  name: string;
  /** Optional context, e.g. "Google review" or client role */
  source?: string;
  stars: number;
}

export const GOOGLE_RATING = { stars: 5.0, count: 9 };

export const TESTIMONIALS: Testimonial[] = [
  // Awaiting verbatim quotes from the Google Business profile.
];
