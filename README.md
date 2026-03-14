# Prisma OS — Landing Page Builder

Sistema professionale per generare landing page ad alta conversione.
Stack: Next.js 15 · TypeScript · Tailwind CSS · Supabase · Vercel

---

## Setup locale (5 minuti)

### 1. Copia il progetto
```bash
cp -r prisma-os/ il-tuo-percorso/
cd il-tuo-percorso/prisma-os
```

### 2. Installa dipendenze
```bash
npm install
```

### 3. Configura Supabase

1. Vai su https://supabase.com e crea un nuovo progetto gratuito
2. Apri **SQL Editor** e incolla il contenuto di `supabase/schema.sql`
3. Clicca **Run** — le tabelle vengono create automaticamente

### 4. Aggiungi le variabili d'ambiente
```bash
cp .env.example .env.local
```

Apri `.env.local` e incolla:
```
NEXT_PUBLIC_SUPABASE_URL=https://il-tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=la-tua-anon-key
```

Trovi questi valori in: **Supabase Dashboard → Settings → API**

### 5. Avvia in locale
```bash
npm run dev
```

Apri http://localhost:3000 — vieni reindirizzato a `/auth` per registrarti.

---

## Deploy su Vercel (2 minuti)

### Opzione A — Interfaccia Vercel
1. Vai su https://vercel.com/new
2. Importa la cartella del progetto (o collega GitHub)
3. Aggiungi le variabili d'ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clicca **Deploy**

### Opzione B — CLI
```bash
npm install -g vercel
vercel
# Segui le istruzioni, aggiungi le env vars quando richiesto
```

### Dominio personalizzato
Nel pannello Vercel → **Settings → Domains** → aggiungi il tuo dominio.

---

## Struttura cartelle

```
prisma-os/
├── src/
│   ├── app/
│   │   ├── (app)/                    # Routes protette
│   │   │   ├── layout.tsx            # Shell con sidebar
│   │   │   ├── dashboard/page.tsx    # Dashboard principale
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx          # Lista progetti
│   │   │   │   └── [id]/page.tsx     # Dettaglio progetto
│   │   │   └── builder/
│   │   │       ├── new/page.tsx      # Crea nuovo progetto
│   │   │       └── [id]/page.tsx     # Wizard builder
│   │   ├── auth/page.tsx             # Login / Register
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Redirect → /dashboard
│   ├── components/
│   │   └── wizard/
│   │       ├── WizardContext.tsx     # State management wizard
│   │       ├── WizardProgress.tsx   # Progress indicator
│   │       ├── Step1Project.tsx     # Step 1 — Info progetto
│   │       ├── WizardSteps.tsx      # Step 2-5
│   │       └── Step6Generate.tsx    # Step 6 — Genera
│   ├── lib/
│   │   ├── supabase.ts              # Client Supabase
│   │   ├── generator.ts             # Motore generazione landing
│   │   └── projects.ts             # CRUD progetti
│   ├── types/
│   │   └── index.ts                 # Tutti i tipi TypeScript
│   ├── middleware.ts                 # Auth guard routes
│   └── styles/
│       └── globals.css              # Design system Prisma OS
├── supabase/
│   └── schema.sql                   # Schema database completo
├── tailwind.config.ts               # Tokens design Prisma OS
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Come funziona il wizard

Il wizard guida attraverso 6 step:

| Step | Nome | Contenuto |
|------|------|-----------|
| 1 | Progetto | Brand, settore, tipo pagina, CTA, target |
| 2 | Offerta | Prodotto, prezzo, USP, urgenza, garanzia |
| 3 | Branding | Palette, stile visual, logo |
| 4 | Struttura | Tone of voice, lunghezza copy, sezioni |
| 5 | Contenuto | Headline, benefit, contatti, FAQ, recensioni |
| 6 | Genera | Score CRO, generazione HTML, preview, export |

### Verticali supportati
edilizia · moda · palestra · estetica · ristorazione · professionisti · formazione · franchising · saas

### Tipi di pagina
lead_generation · preventivo · vendita_servizio · corso_academy · ecommerce_promo · sales_page · vsl · prenota_call · audit_gratuito · funnel_faq

---

## Funzionalità principali

- ✅ Auth completa (login/register) con Supabase
- ✅ Dashboard con statistiche progetti
- ✅ Lista progetti con ricerca e filtri
- ✅ Wizard 6 step con auto-save
- ✅ Generazione HTML standalone ottimizzata CRO
- ✅ Score conversione con breakdown dettagliato
- ✅ Preview desktop/tablet/mobile
- ✅ Download HTML pronto per hosting
- ✅ Download JSON dati progetto
- ✅ Duplica progetto
- ✅ Rigenera pagina mantenendo dati
- ✅ Dettaglio progetto con tab preview/dettagli/export
- ✅ Design system Prisma OS completo

---

## Iterazioni future suggerite

1. **Integrazione AI** — collegare Claude API per generare copy automaticamente dallo step 5
2. **Template library** — galleria di template per verticale con 1-click apply
3. **Custom domain publish** — pubblicare direttamente su sottodominio dell'agenzia
4. **Analytics** — tracking visite e conversioni per ogni landing
5. **Form webhook** — invio lead via Zapier/Make a CRM
6. **Team/multi-utente** — workspace condiviso per l'agenzia
7. **Versioning** — storico versioni per ogni progetto
8. **A/B test** — generare 2 varianti e confrontare performance
9. **White-label** — rivendere ai clienti con loro brand
10. **Export React** — esportare come componente Next.js invece di HTML puro
