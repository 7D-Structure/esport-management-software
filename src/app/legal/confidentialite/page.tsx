import type { Metadata } from "next";
import { COMPANY, HOST, SITE_NAME, orTodo } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
};

export default function ConfidentialitePage() {
  return (
    <div className="space-y-6 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
        Politique de confidentialité
      </h1>
      <p>
        La présente politique décrit la manière dont {SITE_NAME} traite les
        données personnelles conformément au Règlement Général sur la Protection
        des Données (RGPD).
      </p>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Responsable du traitement
        </h2>
        <p>
          {COMPANY.publisher} ({COMPANY.legalForm}, « {COMPANY.tradeName} »),
          SIREN {orTodo(COMPANY.siren)}. Contact :{" "}
          <a href={`mailto:${COMPANY.contactEmail}`} className="underline">
            {COMPANY.contactEmail}
          </a>
          .
        </p>
        <p>
          Pour les données saisies dans l&apos;espace d&apos;administration
          d&apos;une organisation (joueurs, staff, adhésions…), l&apos;éditeur
          agit en tant que sous-traitant ; l&apos;organisation (association /
          club) reste responsable de traitement des données de ses membres.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Données collectées
        </h2>
        <ul className="list-inside list-disc">
          <li>Compte : nom / pseudo, adresse email, mot de passe (haché).</li>
          <li>
            Profil de recherche d&apos;équipe : jeu, rôle, pseudo FaceIT,
            disponibilités, présentation.
          </li>
          <li>
            Contenus créés : configurations, objectifs, notes, équipes,
            invitations.
          </li>
          <li>
            Données de gestion saisies par une organisation à votre sujet
            (licence, contacts, disponibilités) le cas échéant.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Finalités et base légale
        </h2>
        <ul className="list-inside list-disc">
          <li>
            Fournir le service (gestion de structure esport, recherche
            d&apos;équipe) — exécution du contrat / intérêt légitime.
          </li>
          <li>
            Authentification et sécurité des comptes — intérêt légitime.
          </li>
          <li>
            Synchronisation d&apos;adhésions (HelloAsso) et statistiques
            (FaceIT), uniquement si l&apos;organisation configure ces
            intégrations — exécution du contrat / consentement.
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Durée de conservation
        </h2>
        <p>
          Les données sont conservées tant que le compte ou l&apos;organisation
          est actif. Elles sont supprimées lors de la suppression du compte ou
          de l&apos;organisation. Certaines données peuvent être conservées plus
          longtemps si la loi l&apos;impose.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Vos droits
        </h2>
        <p>
          Vous disposez des droits d&apos;accès, de rectification,
          d&apos;effacement, de portabilité et d&apos;opposition. Depuis la page{" "}
          <a href="/space/account" className="underline">
            Mon compte
          </a>
          , vous pouvez à tout moment :
        </p>
        <ul className="list-inside list-disc">
          <li>
            <strong>Télécharger</strong> l&apos;ensemble de vos données au format
            JSON (portabilité) ;
          </li>
          <li>
            <strong>Supprimer</strong> votre compte et vos données personnelles
            (droit à l&apos;effacement).
          </li>
        </ul>
        <p>
          Pour toute demande, contactez{" "}
          <a href={`mailto:${COMPANY.contactEmail}`} className="underline">
            {COMPANY.contactEmail}
          </a>
          . Vous pouvez également introduire une réclamation auprès de la CNIL
          (www.cnil.fr).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Sécurité
        </h2>
        <p>
          Les mots de passe des comptes sont hachés (bcrypt) et les secrets
          d&apos;intégration (clés d&apos;API, mots de passe de serveurs) sont
          chiffrés au repos. Les données sont stockées dans une base PostgreSQL
          hébergée par {HOST.name}.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Hébergement
        </h2>
        <p>
          {HOST.name} — {HOST.address} —{" "}
          <a
            href={HOST.website}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {HOST.website}
          </a>
          .
        </p>
      </section>
    </div>
  );
}
