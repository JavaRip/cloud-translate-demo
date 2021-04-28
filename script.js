// code adapted from https://cloud.google.com/translate/docs/basic/translating-text#translate_translate_text-nodejs
// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;
const prompt = require('prompt-sync')();

// put filepath to your credentials here
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'api_key/cloud_translation_api_key.json';

// Creates a client
const translate = new Translate();

console.log('Enter text to translate: ');
const text = prompt();
console.log('Enter language to translate to (German: de, French: fr, English: en etc): ')
const target = prompt();

async function translateText() {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log('Translations:');
  translations.forEach((translation, i) => {
    console.log(`${text[i]} => (${target}) ${translation}`);
  });
}

translateText();
