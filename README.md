# ToKnow

**Votre agenda personnel** — événements, notes et météo, tout gardé sur votre appareil.

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

## Déployer sur GitHub Pages

1. **Créez un dépôt** sur GitHub (public ou privé — Pages fonctionne dans les deux cas sur les offres payantes, public uniquement sur l'offre gratuite).

2. **Poussez les fichiers** à la racine du dépôt, sur la branche `main` :

   ```bash
   git init
   git add .
   git commit -m "ToKnow v1"
   git branch -M main
   git remote add origin https://github.com/VOTRE-COMPTE/toknow.git
   git push -u origin main
   ```

3. **Activez Pages** : dépôt → *Settings* → *Pages* → dans **Source**, choisissez **GitHub Actions**.
   Le workflow fourni (`deploy.yml`) se déclenche tout seul et publie le site à chaque `push` sur `main`.

4. **Votre adresse** : `https://VOTRE-COMPTE.github.io/toknow/`

### Variante sans workflow

Si vous préférez le mode simple : *Settings* → *Pages* → **Source : Deploy from a branch** → branche `main`, dossier `/ (root)`. Le site est publié tel quel, sans passer par Actions. Supprimez alors le dossier `.github/`.

> **Important** : ouvrez le site via l'adresse `https://…` et non en double-cliquant sur `index.html`. En `file://`, la géolocalisation est bloquée, donc l'onglet Météo ne peut pas fonctionner.

## Installer ToKnow sur l'écran d'accueil

- **iPhone / iPad** — ouvrez le site dans **Safari** → bouton Partager → *Sur l'écran d'accueil*.
- **Android** — ouvrez le site dans **Chrome** → menu ⋮ → *Ajouter à l'écran d'accueil*.

ToKnow s'ouvre alors en plein écran, sans barre d'adresse, comme une application native. Le nom affiché sous l'icône est **ToKnow**.

## Mode hors-ligne (optionnel)

Le fichier `sw.js` est déjà fourni. Pour l'activer, ajoutez ces quelques lignes dans `index.html`, **juste avant** `</body>` :

```html
<script>
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }
</script>
```

Sans ce bloc, ToKnow fonctionne normalement — il a simplement besoin du réseau à chaque ouverture.
Avec, l'app se lance même hors-ligne ; seule la météo continue d'exiger une connexion.

## La police « Sogea »

Le CSS déclare déjà `@font-face` pour Sogea, mais **le fichier de police n'est pas fourni ici** : c'est une police commerciale, elle n'est pas distribuable.

- **Si vous avez la licence** : déposez le fichier à la racine, nommé exactement **`Sogea.woff2`** (ou `.woff`, `.otf`, `.ttf`). Il sera pris en compte automatiquement, sans modifier le code.
- **Sinon** : ToKnow retombe sur **Poppins** (chargée depuis Google Fonts), une géométrique aux formes rondes très proche. Rien à faire.

## Les icônes

Le dossier `icons/` doit contenir quatre PNG :

| Fichier | Taille | Rôle |
|---|---|---|
| `icon-192.png` | 192 × 192 | icône standard |
| `icon-512.png` | 512 × 512 | icône standard, écran de démarrage |
| `icon-maskable-512.png` | 512 × 512 | version « maskable » (Android) |
| `apple-touch-icon.png` | 180 × 180 | icône iOS |

Sans ces fichiers, ToKnow fonctionne quand même — mais l'icône sur l'écran d'accueil sera générique, et le navigateur affichera des erreurs 404 dans la console.

## Fonctionnement

- **Stockage** : tout reste dans le navigateur (`localStorage`), rien ne quitte l'appareil. Vider les données du navigateur efface les événements et les notes.
- **Météo** : géolocalisation du navigateur + API publique **Open-Meteo**, sans clé d'API.
- **Hors-ligne** : le service worker met l'app en cache ; seule la météo a besoin du réseau.
- **Thème du ciel** : six modes dans Réglages (Auto, Aube, Jour, Coucher, Crépuscule, Nuit). En Auto, le ciel suit l'heure. La barre de navigation prend la même couleur.
- **Prénom** : renseigné dans Réglages, il personnalise l'accueil.

## Notes de sécurité

ToKnow n'envoie aucun mot de passe ni donnée personnelle. Il lit votre position uniquement quand vous ouvrez l'onglet Météo, avec votre accord explicite du navigateur, et cette position n'est transmise qu'à Open-Meteo pour obtenir la prévision.
