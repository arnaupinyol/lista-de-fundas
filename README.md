# Llista de Fundes

**Llista de Fundes** és una aplicació web per gestionar un catàleg de fundes de mòbil.  
Permet seleccionar marques, models i tipus de fundes, així com crear un carretó de selecció exportable a PDF.  
Està pensada per ser pràctica, fàcil d’usar i sense necessitat de manteniment, gràcies a la connexió directa amb **Supabase**.

👉 [Demostració en viu](https://lista-de-fundas.vercel.app/)

---

## 🧾 Descripció general

L’aplicació permet:

- Visualitzar les marques disponibles i els seus models associats.  
- Afegir, editar o eliminar models des d’una interfície senzilla.  
- Gestionar fundes de cada marca, incloent-hi variacions com colors o estils.  
- Afegir fundes a un carretó lateral (carret) amb quantitats i agrupació automàtica.  
- Exportar el carret complet a un fitxer PDF amb tots els models i tipus seleccionats.

Totes les dades (marques, models i fundes) s’emmagatzemen a **Supabase**, de manera que qualsevol canvi a la base de dades es reflecteix immediatament a l’aplicació, sense necessitat de manteniment ni redeploys.

---

## ⚙️ Tecnologies utilitzades

- **React** per la interfície d’usuari  
- **Supabase** com a base de dades i API, permetent modificar el catàleg en temps real  
- **jsPDF** per generar i descarregar el PDF del carret  
- **CSS** modular amb variables i animacions  
- **Vercel** com a plataforma de desenvolupament i desplegament  

---

## 🔁 Flux d’ús

1. Selecciona una marca des de la vista principal  
2. Tria o crea un model associat  
3. Visualitza els tipus de fundes disponibles per a aquest model  
4. Ajusta les quantitats i afegeix-les al carret lateral  
5. Des de la vista de marques, exporta el carret complet a un fitxer PDF  

Gràcies a **Supabase**, qualsevol canvi fet al catàleg (com afegir una nova funda o model) apareix immediatament a la web sense necessitat de tocar el codi.

---

🧱 Exportació del carret

El botó “Exportar carret a PDF” genera un document amb totes les fundes agrupades per model.
Cada línia inclou el tipus de funda, l’estil (si n’hi ha) i la quantitat total.
El fitxer es descarrega automàticament amb un nom com ara:

carret-YYYY-MM-DD.pdf

---

👤 Autor

Desenvolupat per [Arnau Piñol Regàs].
Projecte disponible a https://lista-de-fundas.vercel.app/
