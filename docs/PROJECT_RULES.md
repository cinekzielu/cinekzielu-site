# Zasady projektu Cinek Zielu

Ten dokument definiuje zasady bezpiecznej pracy nad kolejnymi etapami rozwoju strony.

## 1) Zakres zmian i bezpieczeństwo
- **Nie ruszać atlasu/mapy**, jeśli zadanie nie dotyczy bezpośrednio atlasu.
- **Nie ruszać globalnego layoutu** bez wyraźnej prośby.
- **Nie dodawać nowych bibliotek** bez wcześniejszej zgody.
- Każdy etap pracy powinien być możliwie mały, czytelny i łatwy do zweryfikowania.

## 2) Spójność wizualna
- Utrzymywać styl: **dark premium black/gold**.
- Unikać przypadkowych odstępstw kolorystycznych i stylistycznych.
- Dbać o spójne proporcje sekcji i typografii pomiędzy komponentami.

## 3) Zasady homepage
- Homepage pokazuje **selekcję**, a nie pełną bibliotekę treści.
- Na homepage mają być:
  - **3 wybrane filmy**,
  - **3 wybrane kierunki**.
- Pełne listy filmów, wypraw i galerii będą publikowane później na osobnych podstronach.
- CTA kierunków prowadzi obecnie do **`#map`**.

## 4) Zasady dla map i SVG
- Mapy SVG są przygotowane manualnie.
- Przy pracy nad mapami mogą być wymagane specjalne parsery, selektory i stabilne identyfikatory (`id`) w SVG.
- Każda zmiana mapy powinna być wykonywana ostrożnie i tylko wtedy, gdy zadanie dotyczy atlasu.

## 5) Kontrola jakości
- Każdy etap powinien kończyć się komendą build.
- Minimalny check po zakończeniu etapu: `npm run build`.
- Jeżeli build nie przechodzi, etap uznaje się za nieukończony.
