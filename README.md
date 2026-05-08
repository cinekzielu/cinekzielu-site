# Cinek Zielu — React + Vercel

To jest gotowy projekt strony portfolio w React + Vite.

## Uruchomienie lokalnie

1. Zainstaluj Node.js LTS.
2. Otwórz terminal w folderze projektu.
3. Uruchom:

```bash
npm install
npm run dev
```

Strona odpali się lokalnie, najczęściej pod adresem:
http://localhost:5173

## Build produkcyjny

```bash
npm run build
npm run preview
```

## Zdjęcia

Zdjęcia są w folderze:

```text
public/images
```

W kodzie są używane jako:

```jsx
/images/hero.jpg
```

## Deploy na Vercel

Najłatwiejsza ścieżka:
1. Wrzuć projekt na GitHub.
2. Wejdź na Vercel.
3. Add New Project.
4. Import z GitHub.
5. Framework: Vite.
6. Build Command: npm run build.
7. Output Directory: dist.
8. Deploy.

Alternatywnie można użyć Vercel CLI:

```bash
npm i -g vercel
vercel --prod
```
