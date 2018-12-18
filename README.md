# vx

A simple CLI application that listens to your voice, converts it to text, and
copies it to your clipboard, powered by Google Cloud Speech-To-Text API.

![Screenshot](demo.gif)

## Why

- I suffer from repetitive strain injury (osteoarthritis in the fingers, I
  guess), so, it helps a lot if I can type using my voice.

- I am not a native English speaker — macOS’s dictation fails to accurately
  recognize my voice accent.

- macOS’ Dictation does not have a public API that apps can use (not hackable).

- Google Cloud Text to speech enhanced voice models are much more accurate than
  macOS’ Dictation and the free webkitSpeechRecognition API.

## Usage

1. Create a Google Cloud platform project and enable billing on it.

2. Enable the Google Cloud speech API and turn on data logging.

3. [Set up authentication with a service account](https://cloud.google.com/docs/authentication/getting-started).

4. Clone this repository, install the dependencies (yarn).

5. Create a `.env` file in the repo:

   ```
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
   ```

6. Make `vx.js` accessible from the shell:

   ```
   ln -s "$(pwd)/vx.js" ~/bin/vx
   ```

7. Run `vx`, speak, and have your spoken words copied into your clipboard.

## Cost

I have to use the premium "video" voice model which is able to recognize my
voice with acceptable accuracy (none of the other models can do this). The model
is also much better at recognizing speech with a lot of technical terms,
compared to the default model.

It costs USD 0.048 per minute to use. The first 60 minutes per month are free.
