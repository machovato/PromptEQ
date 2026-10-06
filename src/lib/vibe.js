// Composes a sample reply from the current settings so every fader notch visibly changes the preview.
// No API calls — it's assembled from per-scenario building blocks.

export const SCENARIOS = [
  {
    id: "plan", chip: "Review my plan",
    user: "Here's my launch plan: ship Friday, email our whole list, skip the beta. Thoughts?",
    defaultReply: "What a great plan! 🎉 Shipping Friday shows real momentum, and emailing your whole list is a fantastic way to maximize reach. Skipping the beta could definitely save time too. Just make sure your team is aligned. You've got this! Let me know if you'd like help with anything else!",
    context: "Your plan stacks three risks into one moment: a hard date, your entire list, and no beta.",
    verdict: [
      "There's real momentum here, and I'd keep it — but I'd add a small beta before emailing everyone.",
      "The date is fine; skipping the beta is the weak spot. Run a short beta first.",
      "I wouldn't ship this as-is. With no beta and the full list, any bug reaches everyone at once.",
    ],
    points: [
      { literal: "A beta with 50 users catches the bugs that cost the most goodwill.", analogy: "A beta is a dress rehearsal: you find the missing props before the audience arrives." },
      { literal: "Email in waves, so a problem in wave one never reaches wave three.", analogy: "Send email in waves, like opening a floodgate slowly instead of all at once." },
      { literal: "A Friday launch leaves nobody around to fix things over the weekend.", analogy: "Launching on Friday is leaving the stove on as you head out for the weekend." },
    ],
    pushback: "Strongest case against your plan: if launch-day bugs hit your whole list, you spend your best channel on a bad first impression.",
    hedge: "I'm confident about the beta; less sure about Friday — it depends on your weekend coverage.",
    question: "Before you decide: how big is the list, and who's on call this weekend?",
    assumption: "(Assuming a list in the thousands.)",
  },
  {
    id: "explain", chip: "Explain a concept",
    user: "What's an API rate limit?",
    defaultReply: "Great question! An API rate limit is a really important concept in the world of software development. Essentially, it's a restriction that controls how many requests you can make. Rate limits help keep things fair and stable for everyone. I hope this helps! Let me know if you have any other questions! 😊",
    context: "APIs serve many clients at once, so providers need a way to stay fair and stable.",
    verdictByExpertise: {
      new: "A rate limit is a cap on how many requests you can send to an API in a set time, like 100 per minute.",
      peer: "A rate limit caps how many requests a client can make in a time window, e.g. 100/min per API key.",
      expert: "It caps request throughput per key or IP — usually token-bucket or sliding-window — and returns a 429 once you exceed it.",
    },
    points: [
      { literal: "Go over it and you get HTTP 429 errors until the window resets.", analogy: "It's a turnstile: push through too fast and it locks until the next window." },
      { literal: "It protects the service from overload and stops one client hogging capacity.", analogy: "Think of a buffet with a one-plate-at-a-time rule, so everyone gets fed." },
      { literal: "Handle it with retries and exponential backoff, and respect the Retry-After header.", analogy: "When you hit it, back off like knocking on a door: wait, then knock less often." },
    ],
    hedge: "That's the standard model; providers differ, so check their docs for exact limits.",
    question: "Are you hitting a limit right now? If so, which API?",
    assumption: "",
  },
  {
    id: "agree", chip: "“I'm right, right?”",
    user: "Pretty sure we should cut prices 30% to fix churn, right?",
    defaultReply: "You're absolutely right that pricing is a powerful lever! A 30% price cut could definitely help reduce churn and show customers you value them. That's a smart, customer-centric move. Just make sure to monitor the results! 🚀",
    context: "Churn usually comes from value, not price — and a price cut mostly lowers revenue from customers who'd have stayed anyway.",
    verdict: [
      "I can see the appeal, but I don't think a 30% cut is the fix — let's check why people leave first.",
      "Probably not. A 30% cut is expensive and rarely fixes churn on its own.",
      "No — I'd push back on this. A 30% cut lowers revenue from everyone to fix a problem that usually isn't price.",
    ],
    points: [
      { literal: "Read exit surveys and cancellation reasons before touching price.", analogy: "Cutting price for churn is turning up the radio to fix an engine noise." },
      { literal: "A 30% cut needs a big retention jump just to break even.", analogy: "You'd be paying everyone a toll to keep the few who were leaving." },
      { literal: "Test a targeted save offer for at-risk accounts instead.", analogy: "Use a scalpel — a save offer for at-risk accounts — not a sledgehammer." },
    ],
    pushback: "Steelmanning you: if exit surveys say ‘too expensive’ and competitors undercut you, a cut could pay off. Show me that data first.",
    hedge: "Confidence: moderate — I haven't seen your churn data.",
    question: "What do your cancellation reasons actually say?",
    assumption: "(Assuming a subscription product with self-serve plans.)",
  },
];

const OPENERS = ["Love that you're thinking this through!", "Good question."];
const CLOSERS = ["Hope that helps — happy to dig in more!", "Hope that helps!"];

export function composeVibe(s, scenarioId) {
  const sc = SCENARIOS.find(x => x.id === scenarioId) || SCENARIOS[0];
  const candor = s.honesty <= 2 ? 0 : s.honesty === 3 ? 1 : 2;
  let verdict = sc.verdictByExpertise ? sc.verdictByExpertise[s.expertise] : sc.verdict[candor];

  if (s.emoji === "freely") verdict += " 🚀";
  else if (s.emoji === "sparingly" && s.verbosity >= 3) verdict += " ✅";

  // Length decides how many supporting points make the cut; blunt delivery trims one more.
  const count = [0, 1, 2, 3, 3][s.verbosity - 1] - (s.directness === 5 && s.verbosity > 1 ? 1 : 0);
  const points = sc.points.slice(0, Math.max(0, count)).map((p, i) =>
    s.abstraction === 5 || (s.abstraction === 4 && i === 0) ? p.analogy
      : s.abstraction === 3 && i === 1 ? p.analogy
        : p.literal);

  const extras = [];
  if (sc.pushback && s.disagreement === "argue" && s.verbosity >= 2) extras.push(sc.pushback);
  if (s.uncertainty && s.verbosity >= 2) extras.push(sc.hedge);

  const body = s.structure >= 4
    ? points.map(p => `• ${p}`).join("\n")
    : points.join(" ");
  const showContext = s.verbosity >= 3 && s.directness < 5;
  const verdictLine = s.answerOrder === 5 && s.structure >= 4 ? `Bottom line: ${verdict}` : verdict;

  const parts = [];
  if (!s.noFiller && s.directness <= 2) parts.push(OPENERS[s.directness - 1]);
  if (!s.clarify && sc.assumption && s.verbosity >= 3) parts.push(sc.assumption);
  if (s.answerOrder <= 2) parts.push(...[showContext && sc.context, body, verdictLine]);
  else if (s.answerOrder === 3) parts.push(...[showContext && sc.context, verdictLine, body]);
  else parts.push(...[verdictLine, body, showContext && s.verbosity >= 4 && sc.context]);
  parts.push(...extras);
  if (s.clarify && sc.question) parts.push(sc.question);
  if (!s.noFiller && s.directness <= 2) parts.push(CLOSERS[s.directness - 1]);

  const joiner = s.structure >= 3 ? "\n\n" : " ";
  return parts.filter(Boolean).join(joiner);
}
