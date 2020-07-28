const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()

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
  
  // try {
  //   const words = await LanguageService.getLanguageWords(
  //     req.app.get('db'),
  //     req.language.id
  //   );
  //   return res.json({
  //     language: req.language,
  //     words,
  //   });
  //   catch (error) {
  //     next(error);
  //   }

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const headWord = await LanguageService.getHeadWord(
        req.app.get('db'),
        req.language.head
      );
      const data = {
        nextWord: headWord.original,
        totalScorePlaceholder: req.language.total_score,
        wordCorrectCountPlaceholder: headWord.correct_count,
        wordIncorrectCountPlaceholder: headWord.incorrect_count,
      };
      return res.json(data);
    } catch (error) {
      next(error);
    }
    });
    
languageRouter
  .post('/guess', async (req, res, next) => {
      try {
        const { guess } = req.body;
        const db = req.app.get('db');
        if (!guess) {
          return res.status(400).json({
            error: 'No Guess in Req Body'
          });
        }
        //get words array and linked list
        const {words, wordList } = await LanguageService.getWordsLinkedList(db, req.languag);

        //check if the guess submitted is correct
        const { answer, isCorrect, currentWord } = await LanguageService.validateGuess(words, req.language, guess);

        //remove current word from the linked list
        wordList.remove(currentWord.id);

        //insert it at its new memory val (M) position
        wordList.insertAt(currentWord.memory_value, currentWord.id);

        //update the language's head and total score
        const head = wordList.head.value;
        const totalScore = req.language.total_score;
        LanguageService.updateLanguage(db, req.language.id, head, totalScore)
          .then(() => {

            //persist the new word values, and get the next word
            const nextWord = LanguageService.updateWords(db, words, wordList);

            //respond (please clap)
            return res.json({
              answer,
              isCorrect,
              totalScorePlaceholder,
              nextWord: nextWord.original,
              wordCorrectCountPlaceholder: nextWord.correct_count,
              wordIncorrectCountPlaceholder: nextWord.incorrect_count
            });
          });

      } catch (error) {
        next(error);
      }
    
  });

module.exports = languageRouter
