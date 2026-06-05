# SHIRI CARS — Guide de mise en ligne

## Étapes pour mettre le site en ligne (30 min)

---

### 1. Créer un compte Supabase (gratuit)
1. Aller sur https://supabase.com → **Start for free**
2. Créer un nouveau projet (choisir une région Europe)
3. Attendre que le projet démarre (1-2 min)

---

### 2. Créer la base de données
1. Dans Supabase → **SQL Editor**
2. Copier-coller le contenu du fichier `supabase/schema.sql`
3. Cliquer **Run** → Les tables et données de démonstration sont créées

---

### 3. Créer le bucket pour les photos
1. Dans Supabase → **Storage** → **New bucket**
2. Nom : `voitures`
3. Cocher **Public bucket** → Sauvegarder

---

### 4. Créer votre compte administrateur
1. Dans Supabase → **Authentication** → **Users** → **Add user**
2. Entrer votre email et mot de passe
3. C'est ce compte qui servira à vous connecter au panneau admin

---

### 5. Copier vos clés Supabase
1. Dans Supabase → **Settings** → **API**
2. Copier :
   - `Project URL` → c'est `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → c'est `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### 6. Déployer sur Vercel (gratuit)
1. Créer un compte sur https://vercel.com
2. Installer Git sur votre PC et créer un dépôt GitHub avec ce dossier
3. Dans Vercel → **New Project** → importer votre dépôt GitHub
4. Ajouter les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre clé anon Supabase
5. Cliquer **Deploy** → votre site est en ligne !

---

### 7. Accéder au panneau d'administration
- URL : `https://votre-site.vercel.app/admin`
- Se connecter avec l'email et mot de passe créés à l'étape 4

---

## Utilisation quotidienne

### Ajouter une voiture
1. Aller sur `/admin` → **Catalogue Véhicules** → **+ Ajouter un véhicule**
2. Remplir les informations et ajouter des photos
3. Cliquer **Ajouter le véhicule** → apparaît immédiatement sur le site

### Marquer une voiture comme vendue
1. Aller sur `/admin` → **Catalogue Véhicules**
2. Cliquer ✏️ sur la voiture
3. Changer le statut en **Vendu** → **Enregistrer**

### Voir les messages des clients
1. Aller sur `/admin` → **Messages Clients**
2. Les nouveaux messages apparaissent en bleu
3. Cliquer sur 📬 pour marquer comme lu

---

## Développement local (optionnel)

```bash
# Installer les dépendances
npm install

# Créer le fichier .env.local
cp .env.local.example .env.local
# Remplir avec vos clés Supabase

# Lancer le serveur de développement
npm run dev
# → Ouvrir http://localhost:3000
```
