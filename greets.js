const greets = [
  "Today is your best day.",
  "You're closer to your goals than yesterday.",
  "Great things start with small actions.",
  "This is a good day to make progress.",
  "You've got everything you need to succeed.",
  "Every step you take moves you forward.",
  "Make today count.",
  "Your future starts with what you do today.",
  "Your future starts with what you do now.",
  "עבודה טובה",
];

function randomGreets() {
  const index = Math.floor(Math.random() * greets.length);
  return greets[index];
}

module.exports = { randomGreets, greets };
