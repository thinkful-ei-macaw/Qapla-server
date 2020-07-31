const LinkedList = require('../linked-list')

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
        'word_correct',
        'word_incorrect',
      )
      .where({ language_id })
  },

  getWordById(db, head_id) {
    return db
      .from('word')
      .select(
         'id',
         'language_id',
         'original',
         'translation',
         'next',
         'memory_value',
         'word_correct',
         'word_incorrect',
      )
      .where({ id: head_id })
      .first();
  },

  //optional service
  getHead(db, user_id) {
    return db
      .from('language').join('word', 'head', 'word.id')
      .select(
        'id',
         'language_id',
         'original',
         'translation',
         'next',
         'memory_value',
         'word_correct',
         'word_incorrect',
      )
      .where({ user_id: user_id })
      .first();
  },

  getTail(db,) {
    return db
      .from()
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
      currentWord.word_correct++;
      currentWord.memory_value *=2;
    } else {
      currentWord.word_incorrect++;
      currentWord.memory_value = 1;
    }
    return { answer, isCorrect, currentWord };
  },


  async getWordsLinkedList(db, {id, head }) {
    const words = await this.getLanguageWords(db, id);
    const wordList = new LinkedList();

    //wordList should directly reference 'word' table rather than linked list
    //during the while loop, 

    // insert words into list
    let word = getWordAt(words, head);
    while (word !== null) {
      wordList.insertLast(word.id, word.next); //.insert(word.next).into()
      word = getWordAt(words, word.next);
    }
    return {words, wordList}
  },

  updateLanguage(db, id, head, score) {
    return db('language')
    .where({id})
    .update({ head, total_score: score});
  },


  updateWords(db, words, wordList) {
    let node = wordList.head;
    while (node !== null) {
      const word = getWordAt(words, node.value);
      const data = {
        next: node.next ? node.next.value : null,
        memory_value: word.memory_value,
        word_correct: word.word_correct,
        word_incorrect: word.word_incorrect
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
