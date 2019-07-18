# Thai Finder
App for finding all thai restaurants with ratings above B. Created for a coding challenge.

Live: https://protected-beach-52873.herokuapp.com/get_thai_places

Or Curl: `curl https://protected-beach-52873.herokuapp.com/get_thai_places`

## Technologies Used

### Node.js (8.10.0)
Node seemed like a good choice to build this api on, it's fast, lightweight, and easy to deploy. The major downsides were that I had to do much more boilerplate than say using something like Rails, but I think the speed trade off is definitely worth it. I'm also not as experienced with it as Rails, but creating a rails app for this is major overkill (not to mention slow).

### Postgres (10.9)
I ultimately decided to use a SQL database because the data was very structured, there were relations and aggregation between the data, and in the future I feel like someone would probably want to search throught the data in some way (which is easier with SQL, and SQL indexes).

# Setup Development ENV

1. Run `yarn install`
2. Install postgres and create a DB for the app to use
3. Setup the DATABASE_URL by running `export DATABASE_URL=postgres://frank:password@localhost:5432/api` (heroku gives you this by default)
4. Create an `.env` file and put the `DATABASE_URL` into it. The app will load this for the db connections.
5. Run `yarn migrate up`
6. To populate the data run `yarn process`

# API Endpoints
- `/get_thai_places` - optional `all=true` query flag

# Schema
See Schema.md

# Design Considerations
1. I wanted to ingest only a small portion of the data to save both space and improve performance (Heroku only gives you like 10k free rows in their postgres). Since this app is only for Thai food, I decided to ingest only Thai restaurant Data. I also dropped the violations data, as this is not relevant to the current scope of this project. The ingestion is still quite fast though, even if ingest all the data, as it performs aggreagation, and batches the insert into two queries. To change the script to ingest all cuisine types, you just need to change this line `if (row['CUISINE DESCRIPTION'] === 'Thai')`.
2. I decided to not use an ORM. The application is simple enough right now where I don't need the overhead of an ORM. The trade-off here is that I have to handroll some SQL, and for someone who's not used to reading raw SQL queries, the code is bit a harder to read. It also will be much harder to manage the logic if this application gets more complex (at that point an ORM could always be introduced).
3. The ETL logic I decided to put into a scripts file `processData.js`. Since this is pretty process heavy, it should be run manually when there is a need for it. The trade-off here versus having an endpoint that updates the data is that its definitely more inconvient to do, and someone without access to the server will not be able to trigger updates. In production, I believe something like this should be a scheduled task.

# Future API Features
1. Return all inspections of a restaurant.
2. Ability to search.
3. Paginated query results.

# Testing
To run jest tests run `yarn test`

Added a few basic unit tests as examples. Integration testing requires a bit more work to do for node (one of the downsides).