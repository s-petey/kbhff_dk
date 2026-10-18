#!/bin/bash
# Load all KBHFF schemas + seed default admin (admin@kbhff.dk / admin123)
set -e
DB="$MYSQL_DATABASE"
M="mysql -u root -p$MYSQL_ROOT_PASSWORD --force"

load_dir() {
	for f in $(find "$1" -maxdepth 1 -name '*.sql' | sort); do
		{ echo "SET FOREIGN_KEY_CHECKS=0;"; sed "s/SITE_DB/$DB/g" "$f"; echo "SET FOREIGN_KEY_CHECKS=1;"; } | $M "$DB"
	done
}

# 1. schemas: janitor core, then app tables
load_dir /sql-janitor
load_dir /sql-theme

# 2. default data
load_dir /sql-janitor/default_data
load_dir /sql-theme/default_data

# 3. admin login records (user 2 = Developer group, created by default data)
$M "$DB" <<SQL
INSERT INTO \`$DB\`.\`user_usernames\` (\`user_id\`, \`username\`, \`type\`, \`verified\`, \`verification_code\`)
SELECT 2, 'admin@kbhff.dk', 'email', 1, 'init0000'
WHERE NOT EXISTS (SELECT 1 FROM \`$DB\`.\`user_usernames\` WHERE \`username\` = 'admin@kbhff.dk');

INSERT INTO \`$DB\`.\`user_passwords\` (\`user_id\`, \`password\`)
SELECT 2, '\$2y\$10\$By9BWqgTf7zHbDY7IOfw3OSPmwZtESSCCctgf3C63f7b83d8Wn9vO'
WHERE NOT EXISTS (SELECT 1 FROM \`$DB\`.\`user_passwords\` WHERE \`user_id\` = 2);
SQL

echo "DB init done: schemas loaded, admin@kbhff.dk seeded"
