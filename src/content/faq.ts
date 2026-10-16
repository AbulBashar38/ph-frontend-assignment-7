// Every answer describes how the backend actually behaves; keep them in sync with it
export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "renting",
    title: "Finding and renting",
    items: [
      {
        question: "Is it free to search and apply?",
        answer:
          "Yes. Creating an account, searching, requesting viewings and applying are free. You only pay the rent for a room you've been approved for.",
      },
      {
        question: "How do viewings work?",
        answer:
          "Pick a room and a time up to 90 days ahead. The owner approves it, suggests another time or declines, and you can cancel your request at any point before the viewing.",
      },
      {
        question: "What happens after I apply for a room?",
        answer:
          "The owner reviews your application and approves or rejects it. Pending applications expire after 7 days, so you're never left waiting forever.",
      },
      {
        question: "Can two people be approved for the same room?",
        answer:
          "No. When an owner approves an application, the room is reserved for that tenant and other pending applications for it are closed.",
      },
    ],
  },
  {
    id: "payments",
    title: "Rent and payments",
    items: [
      {
        question: "How does paying rent work?",
        answer:
          "Rent is paid by card through Stripe's secure checkout. Your rental becomes active once the first payment succeeds, and every payment has a downloadable PDF receipt.",
      },
      {
        question: "When is the next month's rent due?",
        answer:
          "Each month's bill appears in your dashboard 7 days before it's due, and we send reminders 3 days and 1 day before the due date.",
      },
      {
        question: "What if a payment fails?",
        answer:
          "Nothing is charged twice. A failed or cancelled payment stays open in your dashboard so you can try again with the same or another card.",
      },
    ],
  },
  {
    id: "roommates",
    title: "Roommates",
    items: [
      {
        question: "How is a roommate match score calculated?",
        answer:
          "Out of 100: budget overlap (25), preferred area (20), move-in date (15), and lifestyle tags, smoking, pets and sleep schedule (10 each). Gender preference isn't scored; it's a filter.",
      },
      {
        question: "When does a roommate see my phone number?",
        answer:
          "Only after you both accept a connection request. Until then, they see your roommate profile but not your contact details.",
      },
    ],
  },
  {
    id: "owners",
    title: "For property owners",
    items: [
      {
        question: "How do I list a property?",
        answer:
          "Sign up as an owner, add the property with photos and amenities, then add each room with its own rent, capacity and move-in date. Publish it when you're ready.",
      },
      {
        question: "Can I take a listing down?",
        answer:
          "Yes. You can disable a listing temporarily or archive it. Existing rentals, payments and history are kept either way.",
      },
    ],
  },
  {
    id: "account",
    title: "Your account",
    items: [
      {
        question: "Can I switch between tenant and owner?",
        answer:
          "Not on the same account: the role is chosen when you sign up. If you need both, use a separate account for each.",
      },
      {
        question: "I forgot my password. What now?",
        answer:
          "Use “Forgot password” on the login page. We email you a 6-digit code; enter it with your new password and you'll be signed out on other devices.",
      },
    ],
  },
];

// A short selection for the home page
export const FAQ_HIGHLIGHTS: FaqItem[] = [
  FAQ_GROUPS[0].items[0],
  FAQ_GROUPS[0].items[2],
  FAQ_GROUPS[0].items[3],
  FAQ_GROUPS[1].items[0],
  FAQ_GROUPS[2].items[1],
];
