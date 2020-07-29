const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const bodyParser = express.json();

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )
      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

  languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const headWord = await LanguageService.getHeadWord(
        req.app.get('db'),
        req.language.head
      );
      const data = {
        next_word: headWord.original,
        total_score: req.language.total_score,
        word_correct: headWord.word_correct,
        word_incorrect: headWord.word_incorrect,
      };
      return res.json(data);
    } catch (error) {
      next(error);
    }
    });
    
languageRouter
  .post('/guess', bodyParser, async (req, res, next) => {
      try {
        const { guess } = req.body;
        const db = req.app.get('db');

        if (!guess) {
          return res.status(400).json({
            error: 'No Guess in Req Body'
          });
        }

        const {words, wordList } = await LanguageService.getWordsLinkedList(db, req.languag);

        const { answer, isCorrect, currentWord } = await LanguageService.validateGuess(words, req.language, guess);

        wordList.remove(currentWord.id);

        wordList.insertAt(currentWord.memory_value, currentWord.id);

        const head = wordList.head.value;
        const total_score = req.language.total_score;
        LanguageService.updateLanguage(db, req.language.id, head, total_score)
          .then(() => {
            const next_word = LanguageService.updateWords(db, words, wordList);

            return res.json({
              answer,
              isCorrect,
              total_score,
              next_word: next_word.original,
              word_correct: next_word.word_correct,
              word_incorrect: next_word.word_incorrect
            });
          });

      } catch (error) {
        next(error);
      }
    
  });

module.exports = languageRouter