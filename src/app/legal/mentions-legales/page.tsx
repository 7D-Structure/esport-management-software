import type { Metadata } from "next";
import { COMPANY, HOST, SITE_NAME, orTodo } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <div className="space-y-6 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
        Mentions légales
      </h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Éditeur du site
        </h2>
        <p>
          Le site {SITE_NAME} est édité par {COMPANY.publisher},{" "}
          {COMPANY.legalForm}, exerçant sous le nom commercial «{" "}
          {COMPANY.tradeName} ».
        </p>
        <ul className="list-inside list-disc">
          <li>SIREN : {orTodo(COMPANY.siren)}</li>
          <li>SIRET : {orTodo(COMPANY.siret)}</li>
          <li>
            Contact :{" "}
            <a
              href={`mailto:${COMPANY.contactEmail}`}
              className="underline"
            >
              {COMPANY.contactEmail}
            </a>
          </li>
          <li>Directeur de la publication : {COMPANY.directorOfPublication}</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Hébergement
        </h2>
        <p>Le site est hébergé par :</p>
        <ul className="list-inside list-disc">
          <li>{HOST.name}</li>
          <li>{HOST.address}</li>
          <li>Téléphone : {HOST.phone}</li>
          <li>
            Site web :{" "}
            <a
              href={HOST.website}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {HOST.website}
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Propriété intellectuelle
        </h2>
        <p>
          L&apos;ensemble des contenus (structure, textes, code) présents sur le
          site, sauf mention contraire, sont la propriété de l&apos;éditeur.
          Toute reproduction ou représentation, totale ou partielle, sans
          autorisation, est interdite.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
          Données personnelles
        </h2>
        <p>
          Le traitement des données personnelles est décrit dans notre{" "}
          <a href="/legal/confidentialite" className="underline">
            politique de confidentialité
          </a>
          .
        </p>
      </section>
    </div>
  );
}
