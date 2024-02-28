CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author CHAR,
    url CHAR NOT NULL,
    title CHAR NOT NULL,
    likes INTEGER DEFAULT 0
);

SELECT "id", "author", "url", "title", "likes" FROM "blogs" AS "blog";

INSERT INTO "blogs" ("id","author","url","title","likes") VALUES (DEFAULT,$1,$2,$3,$4) RETURNING "id","author","url","title","likes";

