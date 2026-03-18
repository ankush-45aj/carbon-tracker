export const PredictionEngine = {
  getResponse: (message) => {
    const msg = message.toLowerCase();

    if (msg.includes("carbon")) {
      return "Carbon footprint is the total greenhouse gas emissions caused by your activities.";
    }

    if (msg.includes("reduce")) {
      return "You can reduce carbon footprint by using public transport, saving electricity, and reducing waste.";
    }

    if (msg.includes("hello")) {
      return "Hey! I'm your eco assistant 🌱";
    }

    return "I'm still learning 🤖. Try asking about carbon footprint!";
  }
};