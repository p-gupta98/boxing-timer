# MVP Planning

**Status:** Draft — in progress
**Date:** September 28, 2026

## User Stories

1. As a coach, I want to be able to see my past timer sessions that I have run. I want to be able to access each day's session so I can review it later.
2. As a coach, I want to run a saved preset for my class, by tapping a saved preset.
3. As a coach, I want to sign up as a new coach and register my information in the system.
4. As a coach, I want to log in and view my account information to distinguish my data from other coaches' data.
5. As a coach, I want to edit a preset if I need to change the timer settings.
6. As a coach, I want to create and save a preset.
7. As a coach, I want to delete a preset I am unhappy with.
8. As a coach, i want to save a session when I run a timer or preset.

## Actors/Roles

### Coach

1. Coach can create timer presets
2. Coach can add, edit, delete presets
3. Coach can create an account and log in
4. Coach can save sessions to their account
5. Coach can log out of their account

**Stretch Features**

### Admin Coach 

1. Admin coach can create, edit, delete their own timer presets.
2. Admin coach can create an admin account and log in.
3. Admin coach can view all other coach accounts in admin dahsboard.
4. Admin coach can monitor each coach's individual activity by going into their account.
5. Admin coach can delete a coach's account by going through an authentication step.
6. Admin coach cannot delete presets in other coach accounts
7. Admin coach can log out of their account

## Domain Model

### Nouns

1. Presets
2. Sessions
3. Coaches

### How they relate to each other

1. There are many Coaches
2. One Coach can have many Presets in their account
3. One Coach can have many Sessions in their account
4. A Preset belongs to one Coach (a preset is not shared across coaches, even if the settings are identical)
5. A session is unique and cannot belong to many coaches - one session can belong to only one coach
