#!/usr/bin/env node
require('dotenv').config({ path: __dirname + '/.env' })
const record = require('node-record-lpcm16')
const speech = require('@google-cloud/speech').v1p1beta1
const ora = require('ora')

function streamingMicRecognize(opts) {
  const client = new speech.SpeechClient()
  const spinner = ora('Initializing...').start()
  const request = {
    config: {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: opts.th ? 'th' : 'en-US',
      model: opts.th ? 'default' : 'video',
      useEnhanced: true,
      enableAutomaticPunctuation: true,
      alternativeLanguageCodes: opts.th ? ['en-US'] : []
    },
    interimResults: true
  }

  let expireTime
  function updateSpinner() {
    if (expireTime) {
      var timeLeft = Math.ceil((expireTime - Date.now()) / 1000)
      spinner.text =
        '[' + timeLeft + 's] ' + (listenedText || '(Waiting for your voice...)')
    }
  }

  var listenedText = ''

  // Create a recognize stream
  const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => {
      if (data.results[0]) {
        const result = data.results[0]
        var text = String(result.alternatives[0].transcript).trim()
        if (result.isFinal) {
          spinner.succeed(text).start()
          require('clipboardy').writeSync(text)
          listenedText = ''
        } else {
          listenedText = result.alternatives[0].transcript
        }
        updateSpinner()
      }
    })

  // Start recording and send the microphone input to the Speech API
  record
    .start({
      sampleRateHertz: 16000,
      threshold: 0,
      verbose: false,
      recordProgram: 'rec',
      silence: '10.0'
    })
    .on('data', () => {
      if (!expireTime) {
        expireTime = Date.now() + 59000
        setTimeout(() => {
          record.stop()
        }, expireTime - Date.now())
      }
    })
    .on('error', console.error)
    .pipe(
      recognizeStream,
      { end: true }
    )
    .on('end', () => {
      spinner.info('Time is up.')
      process.exit(0)
    })

  setInterval(updateSpinner, 1000)
}

require(`yargs`)
  .demand(1)
  .command(
    ['listen', '$0'],
    `Detects speech in a microphone input stream. This command requires that you have SoX installed and available in your $PATH. See https://www.npmjs.com/package/node-record-lpcm16#dependencies`,
    {
      th: {
        alias: 't',
        boolean: true
      }
    },
    streamingMicRecognize
  )
  .help()
  .strict().argv
