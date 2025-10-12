This is a [Twitter clone](https://twitt3r-clone.netlify.app/) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Technologies Used
-  NextJS
-  TailwindCSS
-  TypeScript
-  HTML
- [Deployed with Netlify](https://twitt3r-clone.netlify.app/)
- [Deployed with Vercel](https://tw1tt3r.vercel.app/)

## ToDo
I really just want to nail Twitter's frontend design.
- [x] Get twitter bird svg in black and white.
- [x] Get woff2 for inter.
- [x] Homepage.
- [x] Create a Tweet component
- [x] NavBar component
- [x] Made /home responsive.
- [x] Create a CreatePost component
- [x] The user should be able to post a tweet.
- [ ] User can select emojis from an emoji selector.


Responsiveness
- [x] Click on profile to access aside
- [x] Swipe to right to access aside (in large screens, aside would be visible)
- Clicking an image makes the image go full screen.
- Clicking on a tweet makes the tweet go full screen. Comments appear down below

- Darkmode.

- [x] NavBar icons should be highlighted depending on what icon you click

- [x] User should be able to add images to tweets

- [x] User should be able to like tweets.

- [x] Somewhat responsive plus-icon


- [x] Auth
- [ ] Finish OAuth setup with X and Google

- [ ] Search 'how do I deal with auth and user data if GitHub is handling sign in and signup? There's no password field, so I don't need to store passwords. How do I prevent someone from signing up if they already have an account? How do I get someone to sign up if they don't have one? How do I control the length of sessions? 
How do I send them a Welcome Email?

Is conditionally rendering stuff based on if a session exists okay? Can't client-side JS bypass that kinda stuff?'

- [ ] Push user data to mongoDB on signUp. Check if account already exists though. For signIn, check if user exists.
- [ ] User should be able to change profile picture, name and handle. This should reflect in the mongoDB.
- [ ] Store Tweets and messages in DB.
- [ ] User should be able to message other users.
