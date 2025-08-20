# Étape 1 : Image Node.js (Debian Bullseye pour compatibilité OpenSSL 1.1)
FROM node:18-bullseye

# Étape 2 : Mettre à jour et installer OpenSSL 1.1
RUN apt-get update && \
    apt-get install -y openssl=1.1.* && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Étape 3 : Définir le répertoire de travail
WORKDIR /usr/src/app

# Étape 4 : Copier package.json et package-lock.json
COPY package*.json ./

# Étape 5 : Installer les dépendances Next.js
RUN npm install

# Étape 6 : Copier le reste de l'application
COPY . .

# Étape 7 : Construire l'application Next.js
RUN npm run build

# Étape 8 : Exposer le port utilisé par Next.js
EXPOSE 3000

# Étape 9 : Démarrer Next.js
CMD ["npm", "start"]
