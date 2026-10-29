# ToKnow

**Votre espace personnel** — agenda, notes et météo, tout gardé sur votre appareil.

Un seul fichier HTML, aucune dépendance, aucune donnée envoyée à un serveur.

## Contenu du dépôt

```
.
├── index.html              ← l'application complète (CSS + JS inline)
├── manifest.json           ← métadonnées PWA (nom, icônes, couleurs)
├── sw.js                   ← service worker (lancement hors-ligne)
├── icons/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-512.png
│   └── apple-touch-icon.png
├── .nojekyll               ← empêche GitHub Pages de filtrer les fichiers
└── .github/workflows/deploy.yml
```

> Le fichier de l'application se nomme `toKnow.html` dans les livraisons.
> **Renommez-le `index.html`** avant de le pousser : c'est le nom que
> GitHub Pages sert par défaut à la racine du site.

## Les trois ambiances

Accessibles via **Réglages → Apparence**. Le choix est mémorisé sur l'appareil.

| Ambiance | Fond | Bulles | Texte | Barre du bas |
|---|---|---|---|---|
| **Marbre** | ciel animé, suit l'heure | pierre sculptée | rose et clair | bille de verre |
| **Papier** | blanc fixe | texture cuivre et chrome | noir | soulignement bronze |
| **Pierre brute** | granit foncé | texture émeraude coulée | blanc | soulignement émeraude |

**Seule l'ambiance Marbre porte les décors animés** : à l'aube des papillons et
des coccinelles, le jour des avions et des hélicoptères, au coucher des hiboux
et des chauves-souris, au crépuscule des lucioles, la nuit des étoiles filantes,
un satellite et une soucoupe. Papier et Pierre brute sont volontairement fixes.

## Déployer sur GitHub Pages

1. **Créez un dépôt** sur GitHub (public ou privé — Pages fonctionne dans les
   deux cas sur les offres payantes, public uniquement sur l'offre gratuite).

2. **Poussez les fichiers** à la racine du dépôt, sur la branche `main` :

   ```bash
   git init
   git add .
   git commit -m "ToKnow v1"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/toknow.git
   git push -u origin main
   ```

3. **Activez Pages** : dépôt → *Settings* → *Pages* → **Source : GitHub Actions**.
   Le workflow fourni publie le site à chaque `push` sur `main`.

4. **Votre adresse** : `https://VOTRE-COMPTE.github.io/toknow/`

### Variante sans workflow

*Settings* → *Pages* → **Source : Deploy from a branch** → branche `main`,
dossier `/ (root)`. Le site est publié tel quel, sans passer par Actions.
Supprimez alors le dossier `.github/`.

> **Important** : ouvrez le site via l'adresse `https://…`, jamais en
> double-cliquant sur le fichier. En `file://`, la géolocalisation est bloquée
> et l'onglet Météo ne peut pas fonctionner.

## Installer ToKnow

- **iPhone / iPad** — ouvrez le site dans **Safari** → bouton Partager →
  *Sur l'écran d'accueil*.
- **Android** — ouvrez le site dans **Chrome** → menu ⋮ →
  *Ajouter à l'écran d'accueil*.

ToKnow s'ouvre alors en plein écran, sans barre d'adresse.

## Sauvegarde et restauration

Trois tuiles dans les Réglages :

- **Exporter en .json** — fichier complet et structuré (événements + notes),
  réimportable plus tard ;
- **Exporter en .txt** — version lisible, mise en forme ;
- **Importer** — ouvre le sélecteur de fichiers, restaure un `.json` exporté,
  et **fusionne sans doublons** : les données déjà présentes sont conservées.

**Tout effacer** supprime les événements *et* les notes.

Pour tester la sauvegarde : exportez en `.json`, effacez tout, réimportez.

## Mode hors-ligne (optionnel)

Le fichier `sw.js` est déjà fourni et enregistré depuis la page. L'application
se lance donc hors-ligne ; seule la météo a besoin du réseau.

Le service worker est réglé en **« réseau d'abord »** : vous voyez toujours la
dernière version publiée, et le cache ne sert qu'en cas de coupure.

## La police « Sogea »

Le CSS déclare `@font-face` pour Sogea, mais **le fichier de police n'est pas
distribué ici** : c'est une police commerciale, elle n'est pas redistribuable.

- **Si vous avez la licence** : déposez le fichier à la racine, nommé exactement
  **`Sogea.woff2`** (ou `.woff`, `.otf`, `.ttf`). Il sera pris automatiquement.
- **Sinon** : l'application retombe sur **Poppins**, chargée depuis Google Fonts.

## Les icônes

| Fichier | Taille | Rôle |
|---|---|---|
| `icon-192.png` | 192 × 192 | icône standard |
| `icon-512.png` | 512 × 512 | icône standard, écran de démarrage |
| `icon-maskable-512.png` | 512 × 512 | version « maskable » (Android) |
| `apple-touch-icon.png` | 180 × 180 | icône iOS |

Toutes doivent être de **vrais PNG** — un JPEG renommé `.png` peut être refusé
par certains lanceurs Android. À vérifier si une icône ne s'affiche pas.

## Comment modifier un thème

Tout le rendu d'une ambiance tient dans **cinq variables**, déclarées au début
de la feuille de style. Changer un thème revient à modifier ces quelques lignes.

### Les couleurs de texte

| Variable | Rôle | Marbre | Papier | Pierre brute |
|---|---|---|---|---|
| `--txt-label` | libellés, accents | `#E69CBA` | `#000` | `#fff` |
| `--txt-label-dim` | valeurs secondaires | `#F5CDD0` | `#000` | `#fff` |
| `--txt-strong` | grands chiffres | `#ffffff` | `#000` | `#fff` |
| `--txt-shadow` | ombre des grandes valeurs | `none` | `none` | ombre sombre |
| `--txt-shadow-soft` | ombre des libellés | `none` | ombre claire | ombre sombre |

Elles sont déclarées trois fois : dans `:root` (valeurs par défaut), puis
répétées dans les blocs `body.amb-paper` et `body.amb-stone`. Le thème Marbre
hérite de `body:not(.amb-paper):not(.amb-stone)`.

> **Attention** : si vous ajoutez une variable, déclarez-la dans **les trois
> contextes**. Une variable non définie fait retomber l'élément sur du blanc
> délavé — c'est l'erreur qui a cassé le thème Marbre une fois.

### Les textures

| Variable | Matière |
|---|---|
| `--tex-cuivre` | cuivre et chrome (ambiance Papier) |
| `--tex-emeraude` | émeraude coulée (ambiance Pierre brute) |

Ce sont des images JPEG encodées en base64, déclarées une seule fois dans
`:root`. Pour les remplacer : compressez la nouvelle image à **400 px de
large, qualité 80** (≈ 40 Ko), puis remplacez le contenu de la variable.

> **Syntaxe** : on écrit `var(--tex-cuivre)`, **jamais**
> `url("var(--tex-cuivre)")`. Un navigateur ne résout pas `var()` à
> l'intérieur d'un `url()` : l'image est ignorée et le fond retombe sur sa
> couleur de secours.

### Ajouter une ambiance

1. Déclarez un bloc `body.amb-mienne{ --txt-label:…; --txt-strong:…; }`.
2. Ajoutez son entrée dans la liste `APPEARANCES` (une ligne par ambiance).
3. Si elle ne doit pas avoir d'animations, vérifiez `animationsAllowed()`.

### Les décors animés

Le tableau `SKY_THEMES` définit les six ciels. La fonction `launchCrosser()`
choisit le décor selon le thème effectif — oiseaux à l'aube, avions le jour,
chauves-souris au coucher, lucioles au crépuscule, étoiles la nuit. Chaque
décor a son élément HTML et son animation CSS.

## Notes techniques

- **Stockage** : `localStorage` uniquement. Rien ne quitte l'appareil.
  Vider les données du navigateur efface les événements et les notes.
- **Météo** : géolocalisation du navigateur + API publique **Open-Meteo**,
  sans clé d'API.
- **Textures** : les deux matières (cuivre et chrome, émeraude coulée) sont
  embarquées en base64 dans des variables CSS, déclarées une seule fois.
  Pour les remplacer, il suffit d'éditer `--tex-cuivre` et `--tex-emeraude`.
- **Couleurs de texte** : pilotées par les variables `--txt-label`,
  `--txt-strong` et `--txt-shadow`, déclarées par ambiance. Changer le rendu
  d'un thème revient à modifier ces quelques lignes.

## Notes de sécurité

ToKnow n'envoie aucun mot de passe ni donnée personnelle. La position n'est lue
que lorsque vous ouvrez l'onglet Météo, avec votre accord explicite du
navigateur, et n'est transmise qu'à Open-Meteo pour obtenir la prévision.
