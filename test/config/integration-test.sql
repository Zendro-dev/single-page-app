/*
  Insert admin, editor, and reader users
*/
INSERT INTO users(email, password)
SELECT 'admin@zen.dro', '$2b$10$JaV2B19HT19FF/UeLomHxe5ohrvXCWTIRQjuF7yzz5TbnlOqO.HKa'
WHERE NOT EXISTS (
  SELECT id FROM users WHERE email = 'admin@zen.dro' AND password = '$2b$10$JaV2B19HT19FF/UeLomHxe5ohrvXCWTIRQjuF7yzz5TbnlOqO.HKa'
);

INSERT INTO users(email, password)
SELECT 'editor@zen.dro', '$2b$10$JaV2B19HT19FF/UeLomHxe5ohrvXCWTIRQjuF7yzz5TbnlOqO.HKa'
WHERE NOT EXISTS (
  SELECT id FROM users WHERE email = 'editor@zen.dro' AND password = '$2b$10$JaV2B19HT19FF/UeLomHxe5ohrvXCWTIRQjuF7yzz5TbnlOqO.HKa'
);

INSERT INTO users(email, password)
SELECT 'reader@zen.dro', '$2b$10$JaV2B19HT19FF/UeLomHxe5ohrvXCWTIRQjuF7yzz5TbnlOqO.HKa'
WHERE NOT EXISTS (
  SELECT id FROM users WHERE email = 'reader@zen.dro' AND password = '$2b$10$JaV2B19HT19FF/UeLomHxe5ohrvXCWTIRQjuF7yzz5TbnlOqO.HKa'
);


/*
  Insert aministrator, editor, and reader roles
*/
INSERT INTO roles(name)
SELECT 'administrator'
WHERE NOT EXISTS (
  SELECT id FROM roles WHERE name = 'administrator'
);

INSERT INTO roles(name)
SELECT 'editor'
WHERE NOT EXISTS (
  SELECT id FROM roles WHERE name = 'editor'
);

INSERT INTO roles(name)
SELECT 'reader'
WHERE NOT EXISTS (
  SELECT id FROM roles WHERE name = 'reader'
);

/*
  Associate administrator user to administrator, editor, and reader roles
*/
INSERT INTO role_to_users ("userId", "roleId")
SELECT (SELECT id FROM users WHERE email = 'admin@zen.dro'),
       (SELECT id FROM roles WHERE name = 'administrator')
WHERE NOT EXISTS (
  SELECT id FROM role_to_users
  WHERE
    "userId" = (SELECT id FROM users WHERE email = 'admin@zen.dro') AND
    "roleId" = (SELECT id FROM roles WHERE name = 'administrator')
);

INSERT INTO role_to_users ("userId", "roleId")
SELECT (SELECT id FROM users WHERE email = 'admin@zen.dro'),
       (SELECT id FROM roles WHERE name = 'editor')
WHERE NOT EXISTS (
  SELECT id FROM role_to_users
  WHERE
    "userId" = (SELECT id FROM users WHERE email = 'admin@zen.dro') AND
    "roleId" = (SELECT id FROM roles WHERE name = 'editor')
);


INSERT INTO role_to_users ("userId", "roleId")
SELECT (SELECT id FROM users WHERE email = 'admin@zen.dro'),
       (SELECT id FROM roles WHERE name = 'reader')
WHERE NOT EXISTS (
  SELECT id FROM role_to_users
  WHERE
    "userId" = (SELECT id FROM users WHERE email = 'admin@zen.dro') AND
    "roleId" = (SELECT id FROM roles WHERE name = 'reader')
);

/*
  Associate editor user to editor and reader roles
*/
INSERT INTO role_to_users ("userId", "roleId")
SELECT (SELECT id FROM users WHERE email = 'editor@zen.dro'),
       (SELECT id FROM roles WHERE name = 'editor')
WHERE NOT EXISTS (
  SELECT id FROM role_to_users
  WHERE
    "userId" = (SELECT id FROM users WHERE email = 'editor@zen.dro') AND
    "roleId" = (SELECT id FROM roles WHERE name = 'editor')
);

INSERT INTO role_to_users ("userId", "roleId")
SELECT (SELECT id FROM users WHERE email = 'reader@zen.dro'),
       (SELECT id FROM roles WHERE name = 'reader')
WHERE NOT EXISTS (
  SELECT id FROM role_to_users
  WHERE
    "userId" = (SELECT id FROM users WHERE email = 'reader@zen.dro') AND
    "roleId" = (SELECT id FROM roles WHERE name = 'reader')
);


/*
  Associate reader user to the reader role
*/
INSERT INTO role_to_users ("userId", "roleId")
SELECT (SELECT id FROM users WHERE email = 'editor@zen.dro'),
       (SELECT id FROM roles WHERE name = 'reader')
WHERE NOT EXISTS (
  SELECT id FROM role_to_users
  WHERE
    "userId" = (SELECT id FROM users WHERE email = 'editor@zen.dro') AND
    "roleId" = (SELECT id FROM roles WHERE name = 'reader')
);