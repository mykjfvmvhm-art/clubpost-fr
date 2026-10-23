
import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/PageHeader";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — ClubPost" },
      {
        name: "description",
        content:
          "Informations sur les données utilisées par la version actuelle de ClubPost.",
      },
      { property: "og:title", content: "Confidentialité — ClubPost" },
      {
        property: "og:description",
        content:
          "La version actuelle conserve les données du club et les contenus dans le navigateur.",
      },
    ],
  }),
  component: () => (
    <LegalPage title="Politique de confidentialité">
      <p>
        <strong>
          Version de démonstration — cette politique doit être complétée et
          vérifiée avant tout lancement commercial.
        </strong>
      </p>

      <h2>1. Données enregistrées</h2>
      <p>
        Dans la version actuelle, le profil du club et les contenus enregistrés
        sont conservés dans le stockage local (localStorage) du navigateur
        utilisé. L'application ne propose actuellement ni compte utilisateur ni
        synchronisation entre appareils.
      </p>
      <p>
        Les données locales peuvent être accessibles à toute personne utilisant
        le même profil de navigateur ou ayant accès à l'appareil.
      </p>

      <h2>2. Transmission des données</h2>
      <p>
        Le fonctionnement actuel repose sur un stockage local pour le profil du
        club et les contenus sauvegardés. Ces données ne sont pas enregistrées
        dans une base de données ClubPost par les fonctionnalités actuelles.
      </p>
      <p>
        Le formulaire de contact ne transmet pas automatiquement de message :
        il prépare un texte que tu peux copier ou ouvrir dans ta propre
        messagerie. Le message ne sera envoyé que si tu effectues toi-même
        l'envoi.
      </p>

      <h2>3. Conservation et suppression</h2>
      <p>
        Les données locales restent dans le navigateur jusqu'à leur suppression
        depuis les fonctionnalités de l'application, lorsqu'elles sont
        disponibles, ou jusqu'à l'effacement des données du navigateur.
        L'effacement des données du navigateur peut également supprimer
        d'autres informations enregistrées par des sites.
      </p>

      <h2>4. Sécurité</h2>
      <p>
        ClubPost est actuellement une version de démonstration. Évite d'y
        enregistrer des informations confidentielles ou des données personnelles
        de membres. Toute personne ayant accès au même navigateur peut
        potentiellement consulter les données locales.
      </p>

      <h2>5. Responsable du traitement et droits</h2>
      <p>
        L'identité et les coordonnées du responsable du traitement doivent être
        ajoutées avant le lancement public. Les informations relatives aux
        droits des utilisateurs et à leur exercice doivent être vérifiées et
        complétées en fonction des traitements réellement effectués.
      </p>

      <h2>6. Cookies et services techniques</h2>
      <p>
        Cette page ne constitue pas encore une déclaration exhaustive des
        éventuels traitements réalisés par l'hébergement ou par les services
        techniques utilisés. Les cookies, journaux techniques et éventuelles
        statistiques doivent être vérifiés et documentés avant le lancement.
      </p>

      <h2>7. Évolution du service</h2>
      <p>
        Cette politique devra être mise à jour si ClubPost ajoute des comptes,
        une base de données, des services externes, des statistiques ou d'autres
        fonctionnalités modifiant le traitement des données.
      </p>
    </LegalPage>
  ),
});
