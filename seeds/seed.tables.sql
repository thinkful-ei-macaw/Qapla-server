BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Klingon', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, `Hlja'`, 'Yes', 2),
  (2, 1, `ghobe'`, 'No', 3),
  (3, 1, 'jlyaj', 'I understand', 4),
  (4, 1, `majQa'`, 'Well done', 5),
  (5, 1, `yl'el`, 'Come in', 6),
  (6, 1, `Heghul'meH QaQ jajvam`, 'Today is a good day to die', 7),
  (7, 1, 'qoSlij Datlvjaj', 'Happy Birthday', 8),
  (8, 1, `Hab SoSli' Quch`, 'Your mother has a smooth forehead', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
