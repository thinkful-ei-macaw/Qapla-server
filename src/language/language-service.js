const LinkedList = require('./linked-list')

//helper function to get a word at a given ID
const getWordAt = (words, id) => {
  return id === null
    ? null
    : words.filter(word => word.id === id)[0];
};

// helper function to get the index of a word
const getIndex = (words, id) => {
  return words.findIndex(word => word.id === id);
}

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getHeadWord(db, head_id) {
    return db
      .from('word')
      .select(
         'id',
         'language_id',
         'original',
         'translation',
         'next',
         'memory_value',
         'correct_count',
         'incorrect_count',
      )
      .where({ id: head_id })
      .first();
  },

  validateGuess(words, language, guess) {
    //resolves answer submissions
    let index = getIndex(words, language.head);
    let currentWord = words[index];
    let answer = currentWord.translation;
    let isCorrect = false;
    if (guess.toLowerCase() === answer.toLowerCase()) {
      isCorrect = true;
      language.total_score++;
      currentWord.correct_count++;
      currentWord.memory_value *=2;
    } else {
      currentWord.incorrect_count++;
      currentWord.memory_value = 1;
    }
    return { answer, isCorret, currentWord };
  },


  async getWordsLinkedList(db, {id, head }) {
    const words = await this.getLanguageWords(db, id);
    const wordList = new LinkedList();

    // insert words into list
    let word = getWordAt(words, head);
    while (word !== null) {
      wordList.insertLast(word.id, word.next);
      word = getWordAt(words, word.next);
    }
    return {word, wordList}
  },

  updateLanguage(db, id, head_id, score) {
    return db('language')
    .where({id})
    .update({ head_id, total_score: score});
  },


  updateWords(db, words, wordList) {
    let node = wordList.head;
    while (node !== null) {
      const word = getWordAt(words, node.value);
      const data = {
        next: node.next ? node.next.value : null,
        memory_value: word.memory_value,
        correct_count: word.correct_count,
        incorrect_count: word.incorrect_count
      };

      //update each word
      db('word')
        .where({ id: node.value })
        .update(data)
        .then();

      node = node.next;
    }

    //return the next word
    const head = wordList.head.value;
    return getWordAt(words, head);
  }


  };



module.exports = LanguageService
