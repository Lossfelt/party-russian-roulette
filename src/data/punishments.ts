export const punishments: string[] = [
  "Take 2 sips",
  "Take 3 sips",
  "Finish your drink",
  "Take a sip for every player in the game",
  "Give out 3 sips to anyone you choose",
  "Everyone drinks!",
  "Pick someone to drink with you",
  "The person to your left takes 2 sips",
  "The person to your right takes 2 sips",
  "Waterfall! You start, everyone follows",
  "Make a new rule for the rest of the game",
  "Categories: pick a topic, go around until someone fails",
  "Never have I ever: say one, everyone who has done it drinks",
  "You're the Thumb Master until someone else gets this card",
  "Drink with your non-dominant hand until your next turn",
  "Tell your most embarrassing story or take 4 sips",
  "Do your best impression of another player",
  "Speak in an accent until your next turn",
  "Compliment every player or take 5 sips",
  "Do 10 push-ups or take 3 sips",
  "Dance for 15 seconds with no music",
  "Swap drinks with the player of your choice",
  "Take a shot!",
  "Truth or dare: the group decides your fate",
  "No talking for 2 rounds or take 3 sips if you fail",
  "Arm wrestle the player of your choice — loser takes 3 sips",
  "Sing the chorus of a song or take 3 sips",
];

export function getRandomPunishment(): string {
  return punishments[Math.floor(Math.random() * punishments.length)];
}
