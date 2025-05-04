# Media Player

<https://linear-media-player-nathan-drake.netlify.app/>

## Walkthrough

Just a fun side project to learn the browser's audio API, Zustand, and a11y.

The deployed site is at the top of the README. If you want to run it locally, be aware that I used Bun. If you don't have it installed, just use your package manager of choice and create a new lockfile.

### Highlights

#### Audio Player

I initially had the audio player in a hook that was used by the parent card component (MediaPlayer). This worked, but because I was prop drilling to the child components, then entire tree re-rendered every time the playback slider moved, which was multiple times per second. I then tried setting it in Context, but it had the same issue because the Context provider still re-rendered the whole tree.

I finally settled on using Zustand (first time for me). I set all of my state inside of the store so that each child component was only subscribed to the state it needed. Lastly, I broke out the playback slider and volume slider into their own components so that only they re-render when the sliders moved.

> NOTE: If you want to see how it's rendering, uncomment the React Scan script tag in index.html and spin up the dev server.

#### Accessibility

I recently went to a conference (Epic Web Conf) where one of the speakers demoed an a11y concept called a "roving tab index". This was the perfect chance to test it out.

For the track list, v0 initially set the items as clickable divs. This was not focusable at all. Buttons worked better, but that meant that a keyboard user would need to tab through the entire track list to get to the playblack controls.

With a roving tab index, the user can tab into the list, navigate with arrow keys, and then tab straight to the playblack controls.

### Attribution

This project includes music from the following albums:

- **"Deep House"** by _Nul Tiel Records_ is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
- **"Neither and Both"** by _Brylie Christopher Oxley_ is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
