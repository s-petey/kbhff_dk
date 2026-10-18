<?php
// Grant Developer group (3) Janitor access - mirrors the setup wizard
// (superuser.core.class.php getAccessPoints/updateAccess)

$mysqli = false;
for ($i = 0; $i < 60; $i++) {
	$mysqli = @new mysqli("db", "kbhff", "kbhff", "kbhff_dk");
	if (!$mysqli->connect_error && $mysqli->query("SELECT 1 FROM user_access LIMIT 1")) break;
	$mysqli = false;
	sleep(2);
}
if (!$mysqli) {
	fwrite(STDERR, "DB not ready\n");
	exit(1);
}

// already seeded - don't overwrite manual permission changes on restart
$row = $mysqli->query("SELECT COUNT(*) c FROM user_access WHERE user_group_id = 3")->fetch_assoc();
if ($row["c"] > 0) {
	echo "Group 3 access already seeded (" . $row["c"] . " points)\n";
	exit(0);
}

function collect($root, $prefix) {
	$points = array();
	if (!is_dir($root)) return $points;
	$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
	foreach ($it as $f) {
		if ($f->getExtension() !== "php") continue;
		$path = $f->getPathname();
		if (!preg_match('/if[ ]?\(isset\(\$read_access\)[ ]?&&[ ]?\$read_access\)[ ]?\{/', file_get_contents($path))) continue;
		$access_item = array();
		$read_access = true;
		include $path;
		if ($access_item) {
			$points[str_replace(array(".php", $root), array("", $prefix), $path)] = $access_item;
		}
	}
	return $points;
}

$grants = collect("/var/www/html/theme/www", "");
$grants += collect("/var/www/html/submodules/janitor/src/www", "/janitor/admin");

$mysqli->query("DELETE FROM user_access WHERE user_group_id = 3");
$n = 0;
$stmt = $mysqli->prepare("INSERT INTO user_access (user_group_id, controller, action, permission) VALUES (3, ?, ?, 1)");
foreach ($grants as $controller => $actions) {
	foreach ($actions as $action => $grant) {
		if ($grant == 1) {
			$stmt->bind_param("ss", $controller, $action);
			$stmt->execute();
			$n++;
		}
	}
}
echo "Granted $n access points to group 3\n";
