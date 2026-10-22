<?php
/**
 * Upcoming events admin for the ACM Student Chapter site.
 *
 * Saves events to ../data/upcoming.json, which upcoming.html reads on every visit.
 *
 * Access: only at https://mpstmeshirpur.hosting.acm.org/admin/ (the public address
 * answers "not found"), and the folder must be password-protected with
 * cPanel > Directory Privacy. The page refuses to run until it is, so it is never
 * left open by mistake.
 * Works on PHP 7.4 and newer.
 */

declare(strict_types=1);

const DATA_FILE = __DIR__ . '/../data/upcoming.json';
const MAX_TITLE = 120;
const MAX_DESC = 600;
const ADMIN_HOST = 'mpstmeshirpur.hosting.acm.org';
const PUBLIC_SITE = 'https://mpstmeshirpur.acm.org';

// "Today" for past-date checks, in the chapter's time zone rather than the server's.
date_default_timezone_set('Asia/Kolkata');

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header("Content-Security-Policy: default-src 'self'; img-src 'self' " . PUBLIC_SITE . "; style-src 'self' 'unsafe-inline'; script-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'");

// Second lock behind the .htaccess rule: the public address never shows this page.
if (strtolower((string) ($_SERVER['HTTP_HOST'] ?? '')) !== ADMIN_HOST) {
    http_response_code(404);
    exit;
}

// Set by Apache only after a successful Directory Privacy login. PHP_AUTH_USER is
// deliberately not used: it can come from a request header on unprotected folders.
$user = $_SERVER['REMOTE_USER'] ?? $_SERVER['REDIRECT_REMOTE_USER'] ?? '';
if ($user === '') {
    http_response_code(403);
    render_page('Admin locked', '<div class="notice"><h2>This page is locked.</h2>'
        . '<p>Password-protect this folder first: cPanel &rarr; <b>Directory Privacy</b> &rarr; '
        . '<code>public_html/admin</code> &rarr; tick <b>Password protect this directory</b> &rarr; Save, '
        . 'then create a user. Reload this page afterwards.</p></div>');
    exit;
}

session_set_cookie_params(['lifetime' => 0, 'path' => '/admin/', 'secure' => true, 'httponly' => true, 'samesite' => 'Strict']);
session_start();
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** @return array<int, array<string, string>> */
function load_events(): array
{
    if (!is_file(DATA_FILE)) {
        return [];
    }
    $data = json_decode((string) file_get_contents(DATA_FILE), true);
    return is_array($data) ? array_values(array_filter($data, 'is_array')) : [];
}

/** Writes to a temp file, then renames it into place, so readers never see half a file. */
function save_events(array $events): bool
{
    usort($events, function ($a, $b) {
        return strcmp($a['date'], $b['date']);
    });
    $dir = dirname(DATA_FILE);
    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        return false;
    }
    $json = json_encode(array_values($events), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $tmp = DATA_FILE . '.tmp';
    if ($json === false || file_put_contents($tmp, $json . "\n", LOCK_EX) === false) {
        return false;
    }
    chmod($tmp, 0644);
    return rename($tmp, DATA_FILE);
}

function valid_date(string $d): bool
{
    $dt = DateTime::createFromFormat('!Y-m-d', $d);
    return $dt !== false && $dt->format('Y-m-d') === $d;
}

function make_id(string $title): string
{
    $slug = trim((string) preg_replace('/[^a-z0-9]+/', '-', strtolower($title)), '-');
    return 'up-' . substr($slug === '' ? 'event' : $slug, 0, 40) . '-' . bin2hex(random_bytes(2));
}

function text_len(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

$events = load_events();
$errors = [];
$form = ['id' => '', 'title' => '', 'date' => '', 'description' => '', 'formUrl' => ''];
$flash = $_SESSION['flash'] ?? '';
unset($_SESSION['flash']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!hash_equals($_SESSION['csrf'], (string) ($_POST['csrf'] ?? ''))) {
        http_response_code(400);
        $errors[] = 'Your session expired. Reload the page and try again.';
    } else {
        $action = (string) ($_POST['action'] ?? '');

        if ($action === 'delete') {
            $id = (string) ($_POST['id'] ?? '');
            $kept = array_values(array_filter($events, function ($e) use ($id) {
                return ($e['id'] ?? '') !== $id;
            }));
            if (count($kept) === count($events)) {
                $errors[] = 'That event no longer exists.';
            } elseif (save_events($kept)) {
                $_SESSION['flash'] = 'Event deleted.';
                header('Location: ./', true, 303);
                exit;
            } else {
                $errors[] = 'Could not save. Check that public_html/data is writable.';
            }
        }

        if ($action === 'save') {
            foreach (['id', 'title', 'date', 'description', 'formUrl'] as $k) {
                $form[$k] = trim(str_replace("\r\n", "\n", (string) ($_POST[$k] ?? '')));
            }
            if ($form['title'] === '' || text_len($form['title']) > MAX_TITLE) {
                $errors[] = 'Event name is required (up to ' . MAX_TITLE . ' characters).';
            }
            if (!valid_date($form['date'])) {
                $errors[] = 'Pick a valid date.';
            } elseif ($form['id'] === '' && $form['date'] < date('Y-m-d')) {
                $errors[] = 'The date is in the past.';
            }
            if ($form['description'] === '' || text_len($form['description']) > MAX_DESC) {
                $errors[] = 'Describe what will happen (up to ' . MAX_DESC . ' characters).';
            }
            if (strpos($form['formUrl'], 'https://') !== 0 || filter_var($form['formUrl'], FILTER_VALIDATE_URL) === false) {
                $errors[] = 'The form link must be a full address starting with https://';
            }

            if (!$errors) {
                $record = [
                    'id' => $form['id'] !== '' ? $form['id'] : make_id($form['title']),
                    'title' => $form['title'],
                    'date' => $form['date'],
                    'description' => $form['description'],
                    'formUrl' => $form['formUrl'],
                ];
                $found = false;
                foreach ($events as $i => $e) {
                    if (($e['id'] ?? '') === $record['id']) {
                        $events[$i] = $record;
                        $found = true;
                    }
                }
                if (!$found) {
                    if ($form['id'] !== '') {
                        $errors[] = 'That event no longer exists.';
                    } else {
                        $events[] = $record;
                    }
                }
                if (!$errors) {
                    if (save_events($events)) {
                        $_SESSION['flash'] = $found ? 'Event updated.' : 'Event added. It is live on the site now.';
                        header('Location: ./', true, 303);
                        exit;
                    }
                    $errors[] = 'Could not save. Check that public_html/data is writable.';
                }
            }
        }
    }
}

// Editing: ?edit=<id> fills the form, unless a failed POST already did.
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['edit'])) {
    foreach ($events as $e) {
        if (($e['id'] ?? '') === $_GET['edit']) {
            $form = array_merge($form, array_intersect_key($e, $form));
        }
    }
}

$today = date('Y-m-d');
usort($events, function ($a, $b) {
    return strcmp($a['date'] ?? '', $b['date'] ?? '');
});
$upcoming = array_filter($events, function ($e) use ($today) {
    return ($e['date'] ?? '') >= $today;
});
$past = array_reverse(array_filter($events, function ($e) use ($today) {
    return ($e['date'] ?? '') < $today;
}));
$editing = $form['id'] !== '';
$csrf = $_SESSION['csrf'];

function stamp(string $iso): string
{
    $dt = DateTime::createFromFormat('!Y-m-d', $iso);
    return $dt ? $dt->format('d.m.Y · l') : $iso;
}

function event_rows(array $list, string $csrf): string
{
    $out = '';
    foreach ($list as $e) {
        $id = (string) ($e['id'] ?? '');
        $out .= '<li class="row">'
            . '<div class="row__main"><p class="meta amber">' . h(stamp((string) ($e['date'] ?? ''))) . '</p>'
            . '<p class="row__title">' . h((string) ($e['title'] ?? '')) . '</p>'
            . '<p class="row__desc">' . h((string) ($e['description'] ?? '')) . '</p>'
            . '<a class="row__link" href="' . h((string) ($e['formUrl'] ?? '')) . '" target="_blank" rel="noopener noreferrer">' . h((string) ($e['formUrl'] ?? '')) . '</a></div>'
            . '<div class="row__actions"><a class="btn btn--ghost" href="?edit=' . rawurlencode($id) . '#form">Edit</a>'
            . '<form method="post" onsubmit="return confirm(\'Delete this event? This cannot be undone.\')">'
            . '<input type="hidden" name="csrf" value="' . h($csrf) . '"><input type="hidden" name="action" value="delete">'
            . '<input type="hidden" name="id" value="' . h($id) . '"><button class="btn btn--danger" type="submit">Delete</button></form></div>'
            . '</li>';
    }
    return $out;
}

ob_start();
?>
<?php if ($flash !== ''): ?><p class="flash" role="status"><?= h($flash) ?></p><?php endif; ?>
<?php if ($errors): ?>
  <div class="errors" role="alert"><p><b>Not saved:</b></p><ul><?php foreach ($errors as $err): ?><li><?= h($err) ?></li><?php endforeach; ?></ul></div>
<?php endif; ?>

<div class="grid">
  <section>
    <div class="head"><h2 class="meta">Upcoming</h2><p class="meta dim"><?= count($upcoming) ?> on the site</p></div>
    <?php if ($upcoming): ?>
      <ol class="rows"><?= event_rows($upcoming, $csrf) ?></ol>
    <?php else: ?>
      <p class="empty">No upcoming events. Add one with the form.</p>
    <?php endif; ?>

    <?php if ($past): ?>
      <details class="past">
        <summary class="meta">Past events (<?= count($past) ?>, hidden on the site)</summary>
        <ol class="rows"><?= event_rows($past, $csrf) ?></ol>
      </details>
    <?php endif; ?>
  </section>

  <section id="form">
    <div class="head"><h2 class="meta"><?= $editing ? 'Edit event' : 'New event' ?></h2>
      <?php if ($editing): ?><a class="meta dim" href="./">Cancel edit</a><?php endif; ?></div>
    <form method="post" class="card" novalidate>
      <input type="hidden" name="csrf" value="<?= h($csrf) ?>">
      <input type="hidden" name="action" value="save">
      <input type="hidden" name="id" value="<?= h($form['id']) ?>">

      <label for="title">Event name</label>
      <input id="title" name="title" maxlength="<?= MAX_TITLE ?>" required value="<?= h($form['title']) ?>">

      <label for="date">Date</label>
      <input id="date" name="date" type="date" required value="<?= h($form['date']) ?>"<?= $editing ? '' : ' min="' . h($today) . '"' ?>>

      <label for="description">What will happen</label>
      <textarea id="description" name="description" rows="4" maxlength="<?= MAX_DESC ?>" required><?= h($form['description']) ?></textarea>

      <label for="formUrl">Registration form link</label>
      <input id="formUrl" name="formUrl" type="url" placeholder="https://forms.gle/..." required value="<?= h($form['formUrl']) ?>">

      <button class="btn btn--primary" type="submit"><?= $editing ? 'Save changes' : 'Add event' ?></button>
    </form>
  </section>
</div>
<?php
render_page('Upcoming events admin', (string) ob_get_clean(), $user);

function render_page(string $title, string $body, string $user = ''): void
{
    ?><!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= h($title) ?> — ACM Student Chapter</title>
<link rel="icon" type="image/svg+xml" href="<?= PUBLIC_SITE ?>/seal-v3.svg">
<style>
:root{--charcoal:#171c1b;--olive:#292f27;--olive-high:#333a30;--cream:#e8dcc0;--cream-dim:#b9b09a;--carbon:#1c211e;--amber:#e6a34a;--amber-high:#f0b45f;--burnt:#e08a55;--green:#93a28a;--line:#454c41}
*{box-sizing:border-box}
html{background:var(--charcoal);color-scheme:dark}
body{margin:0;background:var(--charcoal);color:var(--cream);font:16px/1.55 "IBM Plex Sans",system-ui,sans-serif}
a{color:inherit}
h1,h2,p,ul,ol{margin:0}
ol,ul{padding:0;list-style:none}
.meta{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:.8125rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase}
.amber{color:var(--amber)}.dim{color:var(--cream-dim)}
.bar{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px clamp(16px,4vw,56px);border-bottom:1px solid var(--line)}
.bar a{text-decoration:none}
.wrap{max-width:1200px;margin:0 auto;padding:clamp(28px,5vw,64px) clamp(16px,4vw,56px)}
h1{font:800 clamp(2.4rem,6vw,4.5rem)/.9 "Big Shoulders Display","Arial Narrow",sans-serif;text-transform:uppercase;padding-bottom:20px;border-bottom:2px solid var(--cream);margin-bottom:32px}
.grid{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:clamp(28px,5vw,72px);align-items:start}
.head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding-bottom:12px;border-bottom:2px solid var(--cream)}
.head h2{color:var(--amber)}
.row{display:flex;justify-content:space-between;gap:20px;padding:20px 0;border-bottom:1px solid var(--line)}
.row__main{min-width:0}
.row__title{font-weight:600;font-size:1.15rem;margin-top:4px}
.row__desc{color:var(--cream-dim);margin-top:4px}
.row__link{display:inline-block;margin-top:6px;font-size:.875rem;color:var(--green);word-break:break-all}
.row__actions{display:flex;gap:8px;align-items:flex-start;flex:none}
.row__actions form{margin:0}
.empty{color:var(--cream-dim);padding:20px 0}
.past{margin-top:28px}
.past summary{cursor:pointer;color:var(--cream-dim);padding:10px 0}
.past .row{opacity:.7}
.card{display:flex;flex-direction:column;gap:6px;padding-top:16px}
label{font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:.8125rem;letter-spacing:.06em;text-transform:uppercase;color:var(--green);margin-top:12px}
input,textarea{font:inherit;color:var(--cream);background:var(--olive);border:1px solid var(--line);padding:12px 14px;width:100%;border-radius:0}
input:focus,textarea:focus{outline:2px solid var(--amber);outline-offset:1px;border-color:var(--amber)}
textarea{resize:vertical}
input[type=date]{color-scheme:dark}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 18px;font:600 .95rem "IBM Plex Sans",system-ui,sans-serif;text-decoration:none;border:2px solid transparent;cursor:pointer;background:none;color:var(--cream)}
.btn--primary{background:var(--amber);color:var(--carbon);margin-top:20px;min-height:52px}
.btn--primary:hover{background:var(--amber-high)}
.btn--ghost{border-color:var(--line)}
.btn--ghost:hover{border-color:var(--cream)}
.btn--danger{border-color:var(--line);color:var(--burnt)}
.btn--danger:hover{border-color:var(--burnt)}
.flash{background:var(--olive-high);border-left:3px solid var(--amber);padding:12px 16px;margin-bottom:24px}
.errors{background:#3a2a22;border-left:3px solid var(--burnt);padding:12px 16px;margin-bottom:24px}
.errors ul{margin-top:6px;padding-left:18px;list-style:disc}
.notice{max-width:60ch}.notice h2{font-size:1.4rem;margin-bottom:10px}.notice code{color:var(--amber)}
:focus-visible{outline:2px solid var(--amber);outline-offset:2px}
@media (max-width:860px){.grid{grid-template-columns:1fr}#form{order:-1}}
@media (max-width:520px){.row{flex-direction:column}}
</style>
</head>
<body>
<header class="bar">
  <a class="meta amber" href="<?= PUBLIC_SITE ?>/">ACM Student Chapter · Admin</a>
  <span class="meta dim"><?= $user !== '' ? 'Signed in as ' . h($user) . ' · ' : '' ?><a href="<?= PUBLIC_SITE ?>/upcoming.html" target="_blank" rel="noopener">View page</a></span>
</header>
<main class="wrap">
  <h1>Upcoming events.</h1>
  <?= $body ?>
</main>
</body>
</html>
<?php
}
