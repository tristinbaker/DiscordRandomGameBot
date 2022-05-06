# Discord Random Game Bot

This bot was originally written in Ruby, but I decided to rewrite it in NodeJS for practicing NodeJS.

This bot will go to the user's Steam profile, read all of their games, creating a list of games, and then suggest a random one from that list.

## Additional Features

;;hltb {game_name} - Pulls data from HowLongToBeat.com, shows how long on average a game takes to beat

;;itad {game_name} - Pulls data from IsThereADeal.com, shows if there are any deals on a game

;;gib - GamesIBeat, keeps track of games everyone in the server has beat

## Troubleshooting

Oftentimes, a user will have their game display settings set to private. For this specific bot to work, this setting must be public.
