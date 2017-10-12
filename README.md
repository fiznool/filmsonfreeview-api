# Films on Freeview API

This API is for use by the films on freeview app.

The codebase is split into three sections.

## Importer

The data is seeded from a remote server. Since there is no immediately obvious API that can be used, the data is scraped from nextfilm.co.uk. The importer's job is to scrape the data and produce it in a format which can be imported into the database.

Note that if the importer is run locally, a fake data endpoint will be used instead. This is to prevent heavy access to the nextfilm website during development.

## Seeder

The imported data is then seeded into the postgres database via the seeder.

## Server

Finally the data is served via a graphql endpoint for consumption by the clients.

# Setup

``` bash
yarn
```

# Usage

First of all ensure that you have a postgres server running somwhere.

Next create a `.env` file. Add the variable `DATABASE_URL` and set it to the postgres connection URL. Also add a variable `PORT` and set it to `5000`.

Then:

``` bash
# start the graphql server on the specified port
yarn start

# seed the data for the first time
yarn run seed

# update the data from the far end
yarn run import
```

# Explore

There is a graphiql endpoint which can be used to explore the graphql-served data. Find it at `http://localhost:5000/graphiql`. Try the following query:

```
{
  allFilms {
    nodes {
      name
      year
      synopsis
      tmdbId
    }
  }
}
```
