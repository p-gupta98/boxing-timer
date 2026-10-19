# MVP Planning

**Status:** Draft — in progress
**Date:** September 28, 2026 (updated October 19, 2026)

## User Stories

1. As a user, I want to be able to see my past timer sessions that I have run. I want to be able to access each day's session so I can review it later.
2. As a user, I want to run a saved preset for my workout by tapping it.
3. As a user, I want to sign up for an account and register my information in the system.
4. As a user, I want to log in and view my account information, so that my data is kept separate from other users' data.
5. As a user, I want to edit a preset if I need to change the timer settings.
6. As a user, I want to create and save a preset.
7. As a user, I want to delete a preset I am unhappy with.
8. As a user, I want to save a session when I run a timer or preset.

## Actors/Roles

### User
- User can create an account, log in, and log out
- User can create, edit, and delete their own presets
- User can save sessions to their account
- User can view their own past sessions

## Out of Scope / Future
- Deleting sessions (decided against for now, can be revisited)
- Admin accounts: an admin dashboard, viewing other accounts, deleting accounts
- AI feature that calls out boxing combos while the fight timer is running
- Features for a specific audience (e.g. coaches or gyms), to be decided after the MVP

## Domain Model

### Nouns
- Users
- Presets
- Sessions

### How they relate to each other
- There are many Users
- One User can have many Presets in their account
- One User can have many Sessions in their account
- A Preset belongs to one User (a preset is not shared across users, even if the settings are identical)
- A Session belongs to one User (a session cannot belong to many users)
- A Session can optionally be linked to the Preset it was run from