# Exercise Tracker

This project was done as a part of Backend development and APIs course on Freecodecamp and is a exact replica of [https://exercise-tracker.freecodecamp.rocks/](https://exercise-tracker.freecodecamp.rocks/).

There will be examples on the site on how to use the api.

You can create a new user using the 'Create a New User' form. The user will be stored on a mongoDB database. When you create a user, you will get a json of the user with username and a alphanumberic id. Use this id as a unique identifier to add user exercise logs to database. 

You can query the database with user_id using `/api/user/:_id/logs`. It will send a json with all the exercises in the logs field. You can limit the number of exercises you want to query. You can also set from and to date to get exercises doen by a user in a specified range.


The project is hosted on replit: