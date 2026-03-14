import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const createClient = () => createClientComponentClient();
```

**4.** Salva (Ctrl+S) → chiudi Blocco Note

**5.** Torna nel terminale e scrivi:
```
git add .
git commit -m "fix supabase"
git push origin main