use it_demo_p;

-- Blog Post Manager tables

	CREATE TABLE blog_users (
	  id INT AUTO_INCREMENT PRIMARY KEY,
	  first_name VARCHAR(100) NOT NULL,
	  email VARCHAR(255) NOT NULL UNIQUE,
	  mobile VARCHAR(20),
	  age INT,
	  password VARCHAR(255) NOT NULL,
	  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

describe blog_users;
select * from blog_users;




-- table for posts
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,  -- Store the name of the user who created the post
  category VARCHAR(100),
  image_url VARCHAR(500),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

	
select * from posts;
drop table posts;


-- Comments-- 
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT,
  author_name VARCHAR(100) NOT NULL,  -- Store the commenter's name
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES blog_users(id) ON DELETE CASCADE
);
drop table comments;



