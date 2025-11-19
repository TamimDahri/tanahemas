<?php
$slug = $_GET["slug"] ?? '';

$json = file_get_contents("news_data.json");
$articles = json_decode($json, true);

$selectedArticle = null;

foreach ($articles as $article) {
    if ($article["slug"] === $slug) {
        $selectedArticle = $article;
        break;
    }
}

if (!$selectedArticle) {
    echo "Article not found.";
    exit;
}

// Load markdown file
$mdFile = "LamanBerita/" . $selectedArticle["contentSource"];
$markdownContent = file_get_contents($mdFile);

// Convert markdown → HTML
require_once "Parsedown.php";
$Parsedown = new Parsedown();
$htmlContent = $Parsedown->text($markdownContent);

?>
<!DOCTYPE html>
<html>
<head>
    <title><?= $selectedArticle["title"] ?></title>
</head>
<body>
    <h1><?= $selectedArticle["title"] ?></h1>
    <p><?= $selectedArticle["date"] ?></p>

    <img src="<?= $selectedArticle["image"] ?>" style="width:100%;">

    <div>
        <?= $htmlContent ?>
    </div>
</body>
</html>
