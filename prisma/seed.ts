/**
 * Seed the database with believable Nova Terra demo data.
 * Run with: npx prisma db seed   (or `npm run db:seed`)
 *
 * Demo accounts (password: `password123`):
 *   - citoyen@novaterra.fr  → CITIZEN
 *   - agent@novaterra.fr    → AGENT
 *   - admin@novaterra.fr    → ADMIN
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "password123";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const citizen = await prisma.user.upsert({
    where: { email: "citoyen@novaterra.fr" },
    update: { name: "Camille Duval", passwordHash, role: "CITIZEN" },
    create: {
      name: "Camille Duval",
      email: "citoyen@novaterra.fr",
      passwordHash,
      role: "CITIZEN",
    },
  });

  await prisma.user.upsert({
    where: { email: "agent@novaterra.fr" },
    update: { name: "Sacha Moreau", passwordHash, role: "AGENT" },
    create: {
      name: "Sacha Moreau",
      email: "agent@novaterra.fr",
      passwordHash,
      role: "AGENT",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@novaterra.fr" },
    update: { name: "Alex Novak", passwordHash, role: "ADMIN" },
    create: {
      name: "Alex Novak",
      email: "admin@novaterra.fr",
      passwordHash,
      role: "ADMIN",
    },
  });

  const services = [
    {
      slug: "etat-civil",
      name: "État civil",
      category: "Administration",
      icon: "📜",
      order: 1,
      description:
        "Actes de naissance, mariage, PACS et attestations. Le service centralise les démarches d'état civil des habitants de Nova Terra.",
    },
    {
      slug: "dechets-proprete",
      name: "Déchets et propreté",
      category: "Cadre de vie",
      icon: "♻️",
      order: 2,
      description:
        "Collecte des ordures ménagères, tri sélectif et signalement des dépôts sauvages dans les quartiers de la ville.",
    },
    {
      slug: "voirie",
      name: "Voirie et espaces publics",
      category: "Cadre de vie",
      icon: "🛠️",
      order: 3,
      description:
        "Entretien de la chaussée, nids-de-poule, signalisation et mobilier urbain. Signalez une anomalie en quelques clics.",
    },
    {
      slug: "eclairage-public",
      name: "Éclairage public",
      category: "Cadre de vie",
      icon: "💡",
      order: 4,
      description:
        "Signalement des lampadaires en panne, éclairage des tunnels et des modules d'habitation de la colonie.",
    },
    {
      slug: "espaces-verts",
      name: "Espaces verts",
      category: "Cadre de vie",
      icon: "🌿",
      order: 5,
      description:
        "Serres municipales, parcs et plantations. Découvrez les espaces entretenus par les équipes de la ville.",
    },
    {
      slug: "transports-municipaux",
      name: "Transports municipaux",
      category: "Mobilité",
      icon: "🚆",
      order: 6,
      description:
        "Lignes de transport, horaires et abonnements. Voyagez facilement entre les secteurs de Nova Terra.",
    },
  ];

  for (const service of services) {
    await prisma.municipalService.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  const announcements = [
    {
      slug: "ouverture-plateforme-citoyenne",
      title: "Ouverture de la plateforme citoyenne de Nova Terra",
      excerpt:
        "Créer votre compte, suivre vos demandes et contacter les services municipaux : la plateforme ouvre ses portes.",
      body:
        "Habitants de Nova Terra,\n\nLa ville met en service sa plateforme citoyenne. Vous pouvez désormais créer votre compte, découvrir les services municipaux, lire les annonces officielles et suivre l'avancement de vos demandes.\n\nLes agents municipaux disposent de leur propre espace pour traiter vos demandes dans les meilleurs délais.\n\nBienvenue sur le réseau des services de Nova Terra.",
      published: true,
      publishedAt: new Date("2026-10-01T08:00:00Z"),
    },
    {
      slug: "travaux-ligne-2",
      title: "Travaux sur la ligne 2 des transports municipaux",
      excerpt:
        "La ligne 2 sera interrompue entre les secteurs Nord et Central pendant trois jours.",
      body:
        "Des travaux de maintenance sont programmés sur la ligne 2. La circulation sera interrompue entre les secteurs Nord et Central du 8 au 10 octobre.\n\nUne navette de remplacement circulera toutes les quinze minutes depuis la station centrale.",
      published: true,
      publishedAt: new Date("2026-10-02T09:30:00Z"),
    },
    {
      slug: "collecte-dechets-verts",
      title: "Campagne de collecte des déchets verts",
      excerpt:
        "Une collecte exceptionnelle des déchets verts est organisée dans tous les secteurs.",
      body:
        "La ville organise une collecte exceptionnelle des déchets verts. Déposez vos branchages et résidus de taille aux points de collecte indiqués, du 12 au 15 octobre.",
      published: true,
      publishedAt: new Date("2026-10-03T07:15:00Z"),
    },
  ];

  const admin = await prisma.user.findUniqueOrThrow({ where: { email: "admin@novaterra.fr" } });

  for (const announcement of announcements) {
    await prisma.announcement.upsert({
      where: { slug: announcement.slug },
      update: { ...announcement, authorId: admin.id },
      create: { ...announcement, authorId: admin.id },
    });
  }

  const requests = [
    {
      reference: "REQ-2026-0001",
      subject: "Lampadaire en panne rue des Serres",
      description:
        "Le lampadaire situé devant le module 12 est éteint depuis trois nuits. La rue est très sombre.",
      category: "Éclairage",
      priority: "HIGH",
      status: "SUBMITTED",
    },
    {
      reference: "REQ-2026-0002",
      subject: "Nid-de-poule avenue du Dôme",
      description:
        "Un nid-de-poule s'est formé près du croisement avec la rue Kepler et abîme les véhicules.",
      category: "Voirie",
      priority: "NORMAL",
      status: "IN_REVIEW",
    },
    {
      reference: "REQ-2026-0003",
      subject: "Recensement des arbres du parc central",
      description:
        "Serait-il possible d'obtenir la liste des essences plantées dans le parc central ?",
      category: "Espaces verts",
      priority: "LOW",
      status: "IN_PROGRESS",
    },
    {
      reference: "REQ-2026-0004",
      subject: "Demande d'attestation de domicile",
      description:
        "Je souhaite obtenir une attestation de domicile pour compléter un dossier administratif.",
      category: "État civil",
      priority: "NORMAL",
      status: "RESOLVED",
    },
  ];

  for (const request of requests) {
    await prisma.serviceRequest.upsert({
      where: { reference: request.reference },
      update: {
        subject: request.subject,
        description: request.description,
        category: request.category,
        priority: request.priority,
        status: request.status,
      },
      create: {
        reference: request.reference,
        subject: request.subject,
        description: request.description,
        category: request.category,
        priority: request.priority,
        status: request.status,
        authorId: citizen.id,
        history: {
          create: {
            status: "SUBMITTED",
            note: "Demande créée par l'habitant.",
            actorId: citizen.id,
          },
        },
      },
    });
  }

  const existingMessages = await prisma.contactMessage.count();
  if (existingMessages === 0) {
    await prisma.contactMessage.create({
      data: {
        reference: "MSG-2026-0001",
        subject: "Question sur les horaires de la navette",
        body: "Bonjour, pourriez-vous m'indiquer les horaires de la navette de remplacement de la ligne 2 ?",
        email: "citoyen@novaterra.fr",
        authorId: citizen.id,
        status: "RECEIVED",
      },
    });
  }

  console.log("✅ Nova Terra demo data seeded.");
  console.log(`   citoyen@novaterra.fr / ${DEMO_PASSWORD}`);
  console.log(`   agent@novaterra.fr   / ${DEMO_PASSWORD}`);
  console.log(`   admin@novaterra.fr   / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
