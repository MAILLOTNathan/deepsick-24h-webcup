# 🚀 Terra Nova — Écosystème Numérique pour la Première Ville sur Mars

**Contexte :** Game Jam — 24h pour concevoir et livrer une application fonctionnelle.  
**Thème :** Espace, Mars, exploration spatiale, première ville, colonie intergalactique, Terra Nova.

---

## 🎯 Vision

**Terra Nova** est le cœur numérique de la première ville humaine sur Mars. Cette web-app unifie les services civiques, commerciaux, logistiques et d'urgence de la colonie.

Chaque colon dispose d'un compte citoyen, tandis que les professionnels accèdent à des vues métier adaptées à leurs responsabilités. L'objectif est de rendre l'information, la communication et les interventions accessibles depuis une seule plateforme.

---

## 👥 Comptes et rôles

Un utilisateur possède un compte Terra Nova et un ou plusieurs rôles. L'interface, les données visibles et les actions autorisées varient selon ses habilitations.

| Rôle | Finalité | Fonctions et vues dédiées |
|---|---|---|
| **Citoyen / colon** | Utiliser les services quotidiens | Dashboard personnel, carte, messagerie, signalement, taxi, restauration, portefeuille, démarches administratives |
| **Police / sécurité** | Maintenir la sécurité publique | Centre d'opérations, flux de signalements en direct, carte d'intervention, gestion des arrestations, PV/rapports, dossiers d'incident |
| **Médical / secours** | Répondre aux urgences sanitaires | Triage des urgences, disponibilité des équipes, fiche d'intervention, carte des alertes médicales, suivi des patients simulé |
| **Maintenance / propreté** | Garantir le bon état de la colonie | File de pannes et demandes de nettoyage, carte des incidents, affectation et clôture des interventions |
| **Transport / taxi** | Opérer les déplacements | Vue chauffeur, demandes de course, navigation vers prise en charge, statut véhicule, historique des trajets |
| **Commerçant / restauration** | Fournir des services aux colons | Catalogue/menu, commandes entrantes, préparation, statut de livraison ou retrait, chiffre d'affaires simulé |
| **Agent administratif** | Traiter les démarches citoyennes | Boîte de demandes, validation/refus, délivrance de documents, annonces locales |
| **Haut Conseil / administrateur** | Superviser Terra Nova | Tableau de bord global, statistiques, gestion des utilisateurs/rôles, gestion des annonces et modération |

---

## 🧭 Vues de l'application

### Vues communes

- **Connexion / inscription** : accès sécurisé via NextAuth.
- **Dashboard** : aperçu personnalisé selon le rôle connecté.
- **Carte de Terra Nova** : modules, services, points d'intérêt, zones d'intervention et transports.
- **Centre de notifications** : alertes, changements de statut et messages importants.
- **Profil** : identité de colon, rôles, préférences et portefeuille fictif.

### Vue citoyen

Le citoyen peut consulter les annonces du Haut Conseil, contacter d'autres colons, signaler un incident, appeler un taxi, commander un repas et déposer une démarche administrative.

Son tableau de bord affiche notamment les services proches, les commandes et courses en cours, ses signalements et ses notifications.

### Vue sécurité

Le **Centre d'opérations sécurité** est le cockpit des policiers. Il affiche les signalements critiques en temps réel, leur position, leur priorité et leur statut.

Depuis une fiche d'incident, un policier peut prendre en charge l'intervention, se déclarer en route, consigner une arrestation simulée, rédiger un PV et clôturer le dossier. Les agents ne voient que les données requises pour leurs missions.

### Vue médicale

Le personnel médical voit une liste priorisée d'urgences, la carte des appels, les informations de triage et l'état d'affectation des équipes. Il peut accepter une intervention, mettre à jour son statut et clôturer le dossier médical simulé.

### Vue maintenance

Les équipes techniques voient les pannes, fuites, anomalies de pression et incidents de propreté. Elles peuvent s'affecter une tâche, renseigner son état (`en route`, `en cours`, `résolu`) et joindre un compte-rendu.

### Vue transport

Les chauffeurs reçoivent des demandes de course avec point de départ, destination, prix estimé et priorité. Ils acceptent la course, mettent à jour les étapes du trajet et finalisent le paiement simulé.

### Vue commerçant

Les restaurants et commerces gèrent leur menu ou catalogue, visualisent les commandes et mettent à jour chaque étape : reçue, préparation, prête, livrée ou retirée.

### Vue administrative

Les agents administratifs traitent les demandes de permis, d'autorisation et de ressources. Ils peuvent demander un complément, approuver ou refuser une demande et publier une réponse officielle.

### Vue Haut Conseil

Le Haut Conseil possède une vision de pilotage : incidents ouverts, interventions en cours, disponibilité des services, activité économique simulée et annonces publiques. Il administre les rôles, les comptes et les contenus institutionnels.

---

## 🧩 Fonctionnalités

| Domaine | Fonctionnalités MVP |
|---|---|
| **Communication** | Messagerie, canaux de service, notifications, annonces officielles |
| **Signalement** | Création, type, priorité, position, pièces jointes fictives, cycle de vie, affectation à un service |
| **Sécurité** | Live feed, intervention, arrestation simulée, PV, historique de dossier |
| **Santé** | Signalement médical, triage, affectation, suivi d'intervention simulé |
| **Mobilité** | Commande et suivi de taxi, espace chauffeur, paiement fictif |
| **Commerce** | Menu/catalogue, panier, commande, gestion de préparation |
| **Administration** | Dépôt, traitement et suivi de démarches |
| **Finance** | Portefeuille fictif, solde, historique de transactions simulées |
| **Cartographie** | Points d'intérêt, incidents, véhicules et services selon les permissions |

---

## 🔐 Permissions et accès

Le système doit appliquer un contrôle d'accès fondé sur les rôles (RBAC), côté interface **et** côté serveur. Masquer un bouton ne suffit pas : chaque route API doit vérifier la session et le rôle de l'utilisateur.

Exemples :

- Un citoyen peut créer et suivre ses propres signalements, mais ne peut pas consulter ceux des autres.
- Un policier peut voir et prendre en charge les incidents de sécurité, créer une intervention et rédiger un PV.
- Un agent médical ne voit que les incidents médicaux qui lui sont attribués ou accessibles à son service.
- Un administrateur peut gérer les comptes, attribuer les rôles et publier des annonces.

---

## 🏗️ Architecture technique

| Couche | Technologie | Rôle |
|---|---|---|
| **Application** | Next.js (App Router) | Interface et routes serveur/API |
| **UI** | Tailwind CSS | Design responsive, composants rapides à produire |
| **Authentification** | NextAuth.js | Session, connexion et identité utilisateur |
| **Autorisation** | RBAC dans NextAuth + API routes | Protection des pages, actions et données par rôle |
| **ORM** | Prisma | Accès typé aux données et migrations |
| **Base de données** | PostgreSQL ou SQLite | Données utilisateurs, incidents, commandes, messages |
| **Carte** | Leaflet / React-Leaflet | Carte fictive de la colonie martienne |
| **Temps réel** | Polling court ou SSE | Actualisation des alertes et interventions pour le MVP |
| **Déploiement** | Vercel + Neon/Supabase | Déploiement rapide de démonstration |

### Arborescence suggérée

```text
app/
├── (public)/                 # Landing, connexion
├── dashboard/                # Redirection vers le dashboard du rôle actif
├── citizen/                  # Services citoyen
├── operations/
│   ├── security/             # Police / opérations sécurité
│   ├── medical/              # Secours / médical
│   ├── maintenance/          # Maintenance / propreté
│   ├── transport/            # Chauffeurs / taxis
│   ├── commerce/             # Restaurateurs / commerçants
│   └── administration/       # Agents administratifs
├── council/                  # Haut Conseil / administration globale
├── api/                      # Routes API protégées
└── layout.tsx
components/
├── dashboard/
├── map/
├── reports/
└── ui/
lib/
├── auth.ts                   # Configuration NextAuth et callbacks de rôle
├── prisma.ts                 # Singleton Prisma
└── permissions.ts            # Helpers canAccess(), requireRole()
prisma/
└── schema.prisma
```

---

## 🗃️ Modèle Prisma proposé

Ce modèle reste volontairement compact pour la jam : il couvre les comptes, rôles, incidents, affectations, PV et services principaux sans sur-modéliser le produit.

```prisma
enum Role {
  CITIZEN
  SECURITY
  MEDIC
  MAINTENANCE
  DRIVER
  MERCHANT
  ADMIN_AGENT
  COUNCIL
}

enum ReportType {
  SECURITY
  MEDICAL
  MAINTENANCE
  CLEANLINESS
}

enum ReportStatus {
  OPEN
  ASSIGNED
  EN_ROUTE
  IN_PROGRESS
  RESOLVED
  CLOSED
}

model User {
  id          String       @id @default(cuid())
  name        String?
  email       String       @unique
  image       String?
  roles       UserRole[]
  reports     Report[]     @relation("ReportAuthor")
  assignments Assignment[] @relation("AssignedAgent")
  policeCases PoliceCase[] @relation("ArrestingOfficer")
  orders      Order[]
  messages    Message[]
  createdAt   DateTime     @default(now())
}

model UserRole {
  id     String @id @default(cuid())
  userId String
  role   Role
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, role])
}

model Report {
  id          String       @id @default(cuid())
  type        ReportType
  title       String
  description String
  priority    Int          @default(1)
  status      ReportStatus @default(OPEN)
  latitude    Float?
  longitude   Float?
  authorId    String
  author      User         @relation("ReportAuthor", fields: [authorId], references: [id])
  assignments Assignment[]
  policeCase  PoliceCase?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Assignment {
  id        String   @id @default(cuid())
  reportId  String
  agentId   String
  status    String   @default("ASSIGNED")
  report    Report   @relation(fields: [reportId], references: [id], onDelete: Cascade)
  agent     User     @relation("AssignedAgent", fields: [agentId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PoliceCase {
  id          String   @id @default(cuid())
  reportId    String   @unique
  officerId   String
  suspectName String?
  arrestNotes String?
  fineAmount  Float?
  pvContent   String?
  status      String   @default("OPEN")
  report      Report   @relation(fields: [reportId], references: [id])
  officer     User     @relation("ArrestingOfficer", fields: [officerId], references: [id])
  createdAt   DateTime @default(now())
}

model Order {
  id         String   @id @default(cuid())
  type       String
  status     String   @default("PENDING")
  total      Float
  customerId String
  customer   User     @relation(fields: [customerId], references: [id])
  createdAt  DateTime @default(now())
}

model Message {
  id        String   @id @default(cuid())
  content   String
  senderId  String
  sender    User     @relation(fields: [senderId], references: [id])
  createdAt DateTime @default(now())
}
```

---

## 📅 Roadmap 24h

| Temps | Priorité | Livrable |
|---|---|---|
| **0-2h** | Initialisation | Next.js, Tailwind, Prisma, NextAuth, DB et seed de démo |
| **2-4h** | Identité et rôles | Connexion, rôles dans la session, middleware et redirection vers la bonne vue |
| **4-7h** | UI commune | Layout, navigation, dashboard, carte statique/interative, notifications |
| **7-11h** | Signalements | Création citoyen, liste, statut, affectation, protection API |
| **11-14h** | Démo sécurité | Live feed, carte, prise en charge, intervention, arrestation et PV simulés |
| **14-17h** | Services civils | Vue maintenance ou médical, puis taxi et restauration simplifiés |
| **17-20h** | Administration | Démarches, annonces et vue Haut Conseil simplifiée |
| **20-22h** | Polish | États de chargement, responsive, seed réaliste, tests de parcours |
| **22-24h** | Démo | Script de présentation, données de scénario, corrections finales |

---

## ⭐ Priorités MVP

Ne cherchez pas à finaliser tous les métiers à la même profondeur. Construisez un moteur commun **signalement → affectation → intervention → clôture**, puis faites des interfaces spécialisées par rôle.

Le meilleur parcours de démonstration : un citoyen signale une agression, l'incident arrive en direct dans le centre de sécurité, un policier le prend en charge, renseigne une arrestation et crée un PV simulé. Ce scénario prouve l'intérêt de l'écosystème, du temps réel et des rôles.

### À simuler sans hésiter

- Paiements, solde bancaire et pénalités.
- Localisation GPS, disponibilité des taxis et notifications temps réel.
- Données médicales, arrestations et PV : uniquement des données fictives de démonstration.
- Comptes professionnels pré-seedés pour basculer immédiatement entre les expériences pendant le pitch.

---

## 🎨 Direction visuelle

- **Ambiance :** interface de centre de commandement martien, lisible et sobre.
- **Palette :** noir bleuté `#0B0F19`, gris métal `#1F2937`, orange Mars `#F4A261`, rouge alerte `#E63946`, cyan information `#38BDF8`.
- **Hiérarchie :** badges de statut très visibles, carte au centre des vues opérationnelles, actions critiques accessibles en un clic.
- **Accessibilité :** contraste élevé, couleurs doublées par des libellés/icônes et interface mobile responsive.

---

## ✅ Critères de succès

- Un utilisateur peut se connecter et arriver sur un dashboard adapté à son rôle.
- Les routes et actions sensibles sont protégées côté serveur par les rôles.
- Au moins un scénario complet citoyen → service professionnel est démontrable.
- Les autres rôles possèdent une vue spécifique, même simplifiée.
- La démo présente Terra Nova comme une plateforme cohérente, pas comme une collection de pages indépendantes.

---

**Terra Nova : une seule identité numérique, des services connectés, une ville martienne opérationnelle.** 🚀🔴
