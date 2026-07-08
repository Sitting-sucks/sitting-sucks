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
  {
    quote:
      "You do not get a cookie cutter plan here, Ryan does a fantastic job explaining each exercise and why the movement is good for you. The energy and workouts are great! You will be challenged. There is something for everyone from younger athletes to older populations, and really anyone looking to improve their daily living.",
    name: 'Jorge Palacios',
    source: 'Google review',
    stars: 5,
  },
  {
    quote:
      "Ryan trained me to help improve my knee health and to reduce pain from my injury, Chondromalacia (PFP). Not only did he train me and show how to correctly do the exercises in the program, but he also educated me on why I had knee pain.",
    name: 'Mark Kogel',
    source: 'Google review',
    stars: 5,
  },
  {
    quote:
      "Ryan is the most caring, enthusiastic, and knowledgeable personal trainer I have ever had the pleasure of training with. He makes sure to address your problem areas and customize a regiment that makes sense for you.",
    name: 'Stephanie Sanzari',
    source: 'Google review',
    stars: 5,
  },
  {
    quote:
      "Ryan's passion for helping people is unmatched. You can tell he genuinely cares for his clients success. If you're looking for someone to put everything they have into you and your goals, Ryan is your guy.",
    name: 'Angelo Minuche',
    source: 'Google review',
    stars: 5,
  },
  {
    quote:
      "The best!! Ryan is the best trainer ever! He doesn't just give you a workout, he helps you understand why the movement is good for you and what muscles you are using. He also gives specialized stretches and mobility movements to do to correct over/under used muscles.",
    name: 'Rosa',
    source: 'Google review',
    stars: 5,
  },
  {
    quote:
      "Ryan knows his stuff, but even better than that, he teaches you so you know your stuff as well. The goal here goes beyond weight loss or physical performance (both of which I have accomplished with Sitting Sucks help).",
    name: 'Joe Atanasio',
    source: 'Google review',
    stars: 5,
  },
  {
    quote:
      "I'm an experienced athlete and have researched and followed numerous training methods. I started working with Ryan after a sports related injury to my back. Ryan quickly assessed and isolated the injury location.",
    name: 'Alexei B',
    source: 'Google review',
    stars: 5,
  },
  {
    quote:
      "I have been working out with Ryan over five years! And all I have to say is I can't ever find anyone else who is better than him and he helps you build up muscle and also helps you getting healthier!",
    name: 'Jeni He',
    source: 'Google review',
    stars: 5,
  },
];
