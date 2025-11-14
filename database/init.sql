-- Tabela de utilizadores
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de filmes
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INT,
    genre VARCHAR(100),
    synopsis TEXT,
    popularity_score NUMERIC(5,2) DEFAULT 0
);

-- Tabela de ratings
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_movie_rating UNIQUE (user_id, movie_id)
);

-- Tabela de recomendações
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

-- Dados de exemplo

-- teste
INSERT INTO users (name, email, password_hash)
VALUES ('Utilizador Demo', 'demo@example.com', 'HASH_DEMO')
ON CONFLICT (email) DO NOTHING;

-- exemplo
INSERT INTO movies (title, year, genre, synopsis, popularity_score) VALUES
('Inception', 2010, 'Sci-Fi', 'Um ladrão que rouba segredos dos sonhos tem de executar o golpe perfeito.', 9.5),
('The Matrix', 1999, 'Sci-Fi', 'Um hacker descobre a verdade sobre a sua realidade.', 9.3),
('Interstellar', 2014, 'Sci-Fi', 'Uma equipa viaja através de um buraco de minhoca para salvar a humanidade.', 9.4),
('The Dark Knight', 2008, 'Action', 'Batman enfrenta o Joker em Gotham.', 9.6)
ON CONFLICT DO NOTHING;
