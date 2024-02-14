[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд

MESTO - это учебный проект, представляющий собой лендинг-галерею фотографий собранную на React. На сайте возможно менять имя пользователя, описание и аватар. Реализовывается добавление новой карточки и возможность поставить лайк. Каждую фотографию можно посмотреть в увеличенном размере.

## Функционал

Роуты для пользователей:

GET /users — возвращает всех пользователей из базы
GET /users/:userId — возвращает пользователя по _id
POST /users — создаёт пользователя с переданными в теле запроса name, about и avatar.
Роуты для карточек:

GET /cards — возвращает все карточки из базы
POST /cards — создаёт карточку с переданными в теле запроса name и link, устанавливает поле owner для карточки
DELETE /cards/:cardId — удаляет карточку по _id

## Используемые технологии

- JavaScript:
    - Промисы (Promise)
    - Асинхронность и оптимизация
    - API
- Node.js
- Express
- MongoDB
