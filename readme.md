# Keep Your TV

## Description

Keep Your TV is an app where you can find all the TV Shows and add them to lists, make reviews, add friends and more functionalities.

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **nav-bar** - As a user I can access from any page of my webpage to the home page, the sign up and log in page, my profile (and all its subpages), TV Shows clasified by genre, the most popular Shows, the Top Rated Shows and the Search bar, from where you can find TV Shows and users.
- **homepage** - As a user I want to be able to access the homepage so that I see the latest TV Shows news and the most popular TV Shows.
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **tv shows details** - As a user I want to be able to have access to all the details of any TV show that I choose, its description, cast, trailer, average rate... and have the possibility of adding it to any list (favourite, pending, watched...), and even post a review with a score.
- **cast details** - As a user I want to be able to have access to the cast of the TV Show I have chosen, know their background and some other TV shows where they have appeared.
- **admin panel** - As an admin I want to be able to post news in the homepage, ban users, delete comments from all the users, and have a register of all the banned users (and unban them).

## Backlog

List of other features outside of the MVPs scope

Nav Bar:

- Access from all the website
- Access to the homepage
- Access to Top Rated Shows, Popular Shows and Shows clasified by genre
- Access to the search bar
- Access to the sign up and log in form
- Possibility to log out
- Access to the user profile and its subpages (friends list, shows lists... )

User profile:

- See my profile and add or change a picture
- Upload my profile picture
- See other users profile
- Lists of TV Shows created by the user
- Lists of friends created by the user

Homepage

- See latest news
- See Top rated Shows

TV Shows details

- See some information of each TV Show
- Possibility to add the TV Show to my list of favourites
- Possibility to add the TV Show to my pending, watched or watching list
- Possibility to add reviews with a score (and delete them)
- Possibility to watch the trailer of the TV Show
- Access to the details page of each member of the cast

Actors details

- See some information of actors
- Access to the details page of some of the TV shows in which they have acted

Search results

- Possibility to search for users and TV Shows
- Access to the details page of each TV Show
- Possibility to add and remove friends

Admin panel

- Access to the banned users list
- Possibility to create and add news to the homepage

## ROUTES:


  ### INDEX
- GET /
  - renders the landing page
- GET /shows-search
  - renders the search results page
  ### AUTH
- GET /auth/signup
  - renders the sign up form
- POST /auth/signup
  - redirects to log in form (with flash message)
  - body:
    - username
    - email
    - password
- GET /auth/login
  - renders the login form
- POST /auth/login
  - redirects to the homepage
  - body:
    - username
    - password
- POST /auth/logout
  - access from the nav bar
  - redirects to the log in form
  ### SHOWS
- GET /shows
  - renders the homepage
- GET /shows/popular-shows
  - renders the list of most popular shows
- GET /shows/top-shows
  - renders the list of Top Rated shows
- GET /shows/genre/:genreId
  - renders the list of shows clasified by genre
- GET /shows/:showId/details
  - renders the details page of a certain TV Show
- POST /shows/:showId/details
  - add the TV Show to a certain list (with flash message)
  - add a review: (with flash message)
    - stars score
    - title
    - review
  - redirects to the details page.
- POST /shows/:showId/:reviewId/details/delete
  - delete your own reviews
  - delete all the reviews in case you are admin
- POST /shows/:showId/banned
  - only accesible for the admin
  - ban a user
  ### CAST
- GET /cast/:actorId/details
  - renders the actor details
  ### PROFILE
- GET /profile
  - renders the user profile
- GET /profile/lists
  - renders the all the user's lists
- GET /profile/lists/my-favourites
  - renders the favourite shows list
- GET /profile/lists/watching-shows
  - renders the watching shows list
- GET /profile/lists/watched-shows
  - renders the watched shows list
- GET /profile/lists/pending-shows
  - renders the pending shows list
- POST /profile/update
  - add an image to the profile
- GET /profile/friend-list
  - renders the friends list
- POST /profile/:userId/add-friend
  - add a friend
  - redirects to the friends list
- POST /profile/:userId/delete-friend
  - delete a friend
  - redirects to the friends list
  ### ADMIN
- GET /admin
  - renders the admin panel
- GET /admin/news
  - renders the news form panel
- POST /admin/news
  - add news
  - redirects to the news form panel
- GET /admin/listbanned
  - renders the banned users list
- POST /admin/:userId/unbanned
  - unban a user
  - redirects to the banned users list

## Models

User model

```
username: String
email: String
password: String
role: String, enum: ["user", "admin"]
image: String
isBanned: Boolean
friends: [ref:"user"]

```

Show model

```
apiId: String
status: String, enum: ["pending", "watching", "watched", "nostatus"]
isFav: Boolean
user: [ref:"user"]
name: String
img: String
```

Review model

```
show: String
star: Number, min:1, max:5
title: String
review: String
user: [ref:"user"]
```

News model

```
title: String
image: String
url: String

```

## Links

### Git

[Repository Link](https://github.com/culedev/Keep-Your-TV)

[Deploy Link](https://keepyourtv.herokuapp.com/)

### Slides

[Slides Link](http://slides.com)
