# Projet Flappy Evolution

Ce projet m'a servi à découvrir les bases en conception d'intelligence artificiel par machine Learning.
Le concept était de créer un clone de flappy bird et d'y implémenter un algorithme de QLeanrning avec tensorflow.

## Installation

Ce projet ne nécessite aucune installation et fonctionne sur un simple navigateur en local.
Pour le lancer, ouvrir index.html.

### Prérequis

Tous les liens sont déjà inclus dans la page index.html et les librairies dans leur dossier respectif.
Les librairies utilisées sont : P5.js, TensorFlow.js, jquery ainsi que magic.css (pour la page d'accueil)

### configuration

Vous pouvez changer :

- le nombre de "cobayes" pour alléger le processeur ou accélérer l'apprentissage (régler a 20 par défaut)
- La difficulté du niveau. Cela modifiera la taille du passage dans les obstacles ainsi que leur fréquence

Une fois que vous jugez l'entrainement concluant vous pouvez tenter de vous battre contre la machine via "Sauver le meilleur / Humain VS IA".
Ce bouton vous mettra en concurrence avec le meilleur joueur de la dernière génération.
Si vous cliqué sur ce bouton avant d'avoir entrainé l'ordinateur, vous serez mis en concurrence avec une IA généré aléatoirement.

## Tests

Le projet devrait fonctionner dans tous les navigateurs récents.
Il a été testé depuis un pc sous Windows 10 dans Chrome, Firefox et Edge. 
Ainsi que depuis Chrome sur Android. (Baisser le nombre de cobayes pour ne pas trop chargé le processeur du mobile).

## Sauvegarde

Il est possible d'enregistrer les joueurs entrainé via "sauver les champions" puis "Exporter les champions"
Cela va générer plusieurs fichier d'export :
    - Players.json : Ce fichier contient les classes de tout les joueurs enregistré mais pas leur "cerveau".

Les "cerveaux" serons stocker individuelement dans des fichiers .JSON + .bin (le json contient le model et le .bin contient les "weights" des neuronnes pour ces model)
Le noms de ces fichiers est basé sur le timestamp au moment de la creation pour eviter tout doublons, exemple : 
    - 1564998157945.json + 1564998157945.wights.bin

Pour les rechargers dans le jeux, il suffit de tous les sélectionner (players + models) puis de les importer. 
Ils s'ajouteron aux models déjà stocker si il y'en as.

## Creé avec

* [P5.js](https://p5js.org/) - The game framework used
* [TensorFlow.js](https://www.tensorflow.org/js) - The neural network framework used
* [magic.css](https://github.com/miniMAC/magic) - Used to generate css animations


## Auteur

* **Jérôme Riffier** - *Personnal Project* - [JeromeRiffier](https://github.com/JeromeRiffier)

## License

This project is licensed under the GNU General Public License - see the [LICENSE](LICENSE) file for details

## Remerciements

* Coding train (https://www.youtube.com/user/shiffman) - Pour ces expliquations sur la prise en main de p5.js et tensorflow.js
* Code Bullet (https://www.youtube.com/channel/UC0e3QhIYukixgh5VVpKHH9Q) - Qui m'a donnée l'envie de m'essayer à la création d’IA (notamment sur des jeux)


