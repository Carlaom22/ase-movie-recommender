-- users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- movies
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INT,
    genre VARCHAR(100),
    synopsis TEXT,
    popularity_score NUMERIC(5,2) DEFAULT 0
);

-- ratings
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_movie_rating UNIQUE (user_id, movie_id)
);

-- recommendations
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    rank INT NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_movie_id ON ratings(movie_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);

-- Utilizador demo (já tens este, deixo aqui só por clareza)
INSERT INTO users (name, email, password_hash)
VALUES ('Utilizador Demo', 'demo@example.com', 'HASH_DEMO')
ON CONFLICT (email) DO NOTHING;

-- Mais filmes de exemplo
INSERT INTO movies (title, year, genre, synopsis, popularity_score) VALUES
('The Dark Knight', 2008, 'Action', 'Batman enfrenta o caótico Joker em Gotham.', 9.7),
('Inception', 2010, 'Sci-Fi', 'Um ladrão invade sonhos para implantar ideias.', 9.3),
('Interstellar', 2014, 'Sci-Fi', 'Exploração espacial para salvar a humanidade.', 9.4),
('The Matrix', 1999, 'Sci-Fi', 'Um hacker descobre a verdadeira natureza da realidade.', 9.2),
('Gladiator', 2000, 'Action', 'Um general romano busca vingança.', 8.9),
('Saving Private Ryan', 1998, 'War', 'Missão para resgatar um soldado na II Guerra Mundial.', 9.1),
('The Shawshank Redemption', 1994, 'Drama', 'Esperança e amizade dentro de uma prisão.', 9.9),
('The Silence of the Lambs', 1991, 'Thriller', 'Uma agente do FBI procura um assassino em série.', 8.8),
('Se7en', 1995, 'Thriller', 'Dois detetives perseguem um serial killer.', 8.7),
('The Green Mile', 1999, 'Drama', 'Um guarda prisional encontra um prisioneiro extraordinário.', 9.0),
('Braveheart', 1995, 'History', 'A luta de William Wallace pela liberdade.', 8.6),
('Titanic', 1997, 'Romance', 'Amor trágico a bordo de um navio condenado.', 8.5),
('Avatar', 2009, 'Sci-Fi', 'Humanos exploram um planeta alienígena.', 8.4),
('Joker', 2019, 'Drama', 'A origem sombria de um vilão icónico.', 8.8),
('Whiplash', 2014, 'Drama', 'A obsessão pela perfeição na música.', 8.9),
('The Prestige', 2006, 'Drama', 'Dois mágicos rivais levam a competição ao extremo.', 8.7),
('Django Unchained', 2012, 'Western', 'Um ex-escravo procura libertar a sua esposa.', 8.8),
('The Departed', 2006, 'Crime', 'Infiltrados da polícia e da máfia.', 8.6),
('Goodfellas', 1990, 'Crime', 'A ascensão e queda de um mafioso.', 8.7),
('Scarface', 1983, 'Crime', 'A ambição de um imigrante no mundo do crime.', 8.5)
ON CONFLICT DO NOTHING;


-- Ratings de exemplo para o Utilizador Demo (se existir)
INSERT INTO ratings (user_id, movie_id, score, rating_date)
SELECT u.id, m.id, 5, NOW()
FROM users u
JOIN movies m ON m.title = 'Inception'
WHERE u.email = 'demo@example.com'
ON CONFLICT ON CONSTRAINT unique_user_movie_rating DO NOTHING;

INSERT INTO ratings (user_id, movie_id, score, rating_date)
SELECT u.id, m.id, 4, NOW()
FROM users u
JOIN movies m ON m.title = 'The Matrix'
WHERE u.email = 'demo@example.com'
ON CONFLICT ON CONSTRAINT unique_user_movie_rating DO NOTHING;

INSERT INTO ratings (user_id, movie_id, score, rating_date)
SELECT u.id, m.id, 5, NOW()
FROM users u
JOIN movies m ON m.title = 'The Dark Knight'
WHERE u.email = 'demo@example.com'
ON CONFLICT ON CONSTRAINT unique_user_movie_rating DO NOTHING;
