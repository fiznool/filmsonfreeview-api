begin;

create schema filmsonfreeview;


create table filmsonfreeview.film (
  id          serial primary key,
  name        text not null,
  imdb_id     text,
  imdb_rating text
);

comment on table filmsonfreeview.film is 'A film shown on a Freeview channel.';
comment on column filmsonfreeview.film.id is 'The primary unique identifier for the film.';
comment on column filmsonfreeview.film.name is 'The name of the film.';
comment on column filmsonfreeview.film.imdb_id is 'The ID of the IMDB record for the film';
comment on column filmsonfreeview.film.imdb_rating is 'The IMDB rating of the film.';


create table filmsonfreeview.channel (
  id    serial primary key,
  name  text not null
);

comment on table filmsonfreeview.channel is 'A channel which is showing a Freeview film.';
comment on column filmsonfreeview.channel.id is 'The primary unique identifier for the channel.';
comment on column filmsonfreeview.channel.name is 'The name of the channel.';


create table filmsonfreeview.showtime (
  id serial primary key,
  starts_at timestamp not null,
  ends_at timestamp not null,
  film_id integer not null references filmsonfreeview.film(id),
  channel_id integer not null references filmsonfreeview.channel(id)
);

comment on table filmsonfreeview.showtime is 'The time that a film is being shown on a certain channel on Freeview.';
comment on column filmsonfreeview.showtime.id is 'The primary unique identifier for the showtime.';
comment on column filmsonfreeview.showtime.starts_at is 'The start time for the showtime.';
comment on column filmsonfreeview.showtime.ends_at is 'The end time for the showtime.';
comment on column filmsonfreeview.showtime.film_id is 'The ID of the film being shown.';
comment on column filmsonfreeview.showtime.channel_id is 'The ID of the channel that the film is being shown on.';

commit;