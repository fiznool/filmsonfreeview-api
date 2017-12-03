create table filmsonfreeview.${film_table_name} (
  id            serial primary key,
  name          text not null,
  year          int,
  synopsis      text,
  imdb_url      text,
  tmdb_image_id text,
  tmdb_rating   int
);

comment on table filmsonfreeview.${film_table_name} is 'A film shown on a Freeview channel.';
comment on column filmsonfreeview.${film_table_name}.id is 'The primary unique identifier for the film.';
comment on column filmsonfreeview.${film_table_name}.name is 'The name of the film.';
comment on column filmsonfreeview.${film_table_name}.year is 'The year that the film was made.';
comment on column filmsonfreeview.${film_table_name}.synopsis is 'A short description of the film.';
comment on column filmsonfreeview.${film_table_name}.imdb_url is 'The IMDB URL for the film.';
comment on column filmsonfreeview.${film_table_name}.tmdb_image_id is 'The ID of TheMovieDB poster image for the film.';
comment on column filmsonfreeview.${film_table_name}.tmdb_rating is 'TheMovieDB rating of the film.';


-- create table filmsonfreeview.${channel_table_name} (
--   id    serial primary key,
--   name  text not null
-- );

-- comment on table filmsonfreeview.${channel_table_name} is 'A channel which is showing a Freeview film.';
-- comment on column filmsonfreeview.${channel_table_name}.id is 'The primary unique identifier for the channel.';
-- comment on column filmsonfreeview.${channel_table_name}.name is 'The name of the channel.';


create table filmsonfreeview.${showtime_table_name} (
  id             serial primary key,
  starts_at_date text not null,
  starts_at_time text not null,
  ends_at_date   text not null,
  ends_at_time   text not null,
  film_id        integer not null references filmsonfreeview.${film_table_name}(id),
  channel        text not null
  -- channel_id integer not null references filmsonfreeview.${channel_table_name}(id)
);

comment on table filmsonfreeview.${showtime_table_name} is 'The time that a film is being shown on a certain channel on Freeview.';
comment on column filmsonfreeview.${showtime_table_name}.id is 'The primary unique identifier for the showtime.';
comment on column filmsonfreeview.${showtime_table_name}.starts_at_date is 'The start date for the showtime.';
comment on column filmsonfreeview.${showtime_table_name}.starts_at_time is 'The start time for the showtime.';
comment on column filmsonfreeview.${showtime_table_name}.ends_at_date is 'The end date for the showtime.';
comment on column filmsonfreeview.${showtime_table_name}.ends_at_time is 'The end time for the showtime.';
comment on column filmsonfreeview.${showtime_table_name}.film_id is 'The ID of the film being shown.';
comment on column filmsonfreeview.${showtime_table_name}.channel is 'The channel that the film is being shown on.';
-- comment on column filmsonfreeview.${showtime_table_name}.channel_id is 'The ID of the channel that the film is being shown on.';