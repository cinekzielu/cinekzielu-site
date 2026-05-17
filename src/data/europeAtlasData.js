export const europeAtlasNodes = [
  {
    id: 'europe',
    label: 'Europa',
    code: 'EU',
    type: 'continent',
    status: 'active',
    shortDescription: 'Europa jest kontynentem wypraw — od Skandynawii i Alp po Bałkany i Karpaty.',
    panelDescription: 'Kontynent wypraw z aktywną osią PL/SK/Tatry i kierunkami premium dark relief pod dalszą rozbudowę.',
    position: { x: 286, y: 66, chipWidth: 118 },
    panelTags: ['Aktywny kontynent', 'Premium dark atlas', 'Rozwój krajów i regionów'],
  },
  { id: 'poland', label: 'Polska', code: 'PL', type: 'country', status: 'active', shortDescription: 'Punkt wyjściowy atlasu i jedno z wejść do regionu Tatry.', panelDescription: 'Aktywny kraj bazowy z bezpośrednim przejściem do regionu Tatry.', position: { x: 334, y: 126, chipWidth: 104 }, labelOffset: { x: 14, y: -4 }, panelTags: ['Aktywne', 'Tatry', 'Galerie'], routeTarget: null },
  { id: 'slovakia', label: 'Słowacja', code: 'SK', type: 'country', status: 'active', shortDescription: 'Południowa strona Tatr i kluczowy kraj graniczny atlasu.', panelDescription: 'Aktywny kraj graniczny współtworzący oś wypraw tatrzańskich.', position: { x: 348, y: 164, chipWidth: 112 }, labelOffset: { x: 16, y: 8 }, panelTags: ['Aktywne', 'Tatry', 'Wyprawy'], routeTarget: null },
  { id: 'switzerland', label: 'Szwajcaria', code: 'CH', type: 'country', status: 'visited', shortDescription: 'Alpejski kierunek z rozwijającą się galerią i materiałami filmowymi.', panelDescription: 'Kraj odwiedzony, alpejski materiał foto/film jest już częścią atlasu.', position: { x: 228, y: 201, chipWidth: 124 }, labelOffset: { x: -22, y: 7 }, panelTags: ['Odwiedzone', 'Alpy', 'Galeria'] },
  { id: 'austria', label: 'Austria', code: 'AT', type: 'country', status: 'visited', shortDescription: 'Kraj alpejski z trasami wysokogórskimi i bazą pod kolejne relacje.', panelDescription: 'Kraj odwiedzony, przygotowany pod dalszy rozwój alpejskiej osi.', position: { x: 306, y: 204, chipWidth: 104 }, labelOffset: { x: 14, y: 8 }, panelTags: ['Odwiedzone', 'Alpy', 'Film + foto'] },
  { id: 'germany', label: 'Niemcy', code: 'DE', type: 'country', status: 'planned', shortDescription: 'Kierunek przejściowy i zaplecze logistyczne pod kolejne wyprawy.', panelDescription: 'Kraj planowany jako zaplecze i rozszerzenie Europy Środkowej.', position: { x: 271, y: 130, chipWidth: 102 }, labelOffset: { x: -18, y: -8 }, panelTags: ['W planach', 'Galeria wkrótce', 'Przyszły kierunek'] },
  { id: 'slovenia', label: 'Słowenia', code: 'SI', type: 'country', status: 'planned', shortDescription: 'Planowany kierunek alpejsko-bałkański na kolejny etap atlasu.', panelDescription: 'Kraj planowany w osi alpejsko-bałkańskiej.', position: { x: 330, y: 215, chipWidth: 112 }, panelTags: ['W planach', 'Galeria wkrótce', 'Przyszły kierunek'] },
  { id: 'italy', label: 'Włochy', code: 'IT', type: 'country', status: 'planned', shortDescription: 'Docelowy kierunek południowych Alp i klasycznych przełęczy.', panelDescription: 'Kraj planowany pod rozwój południowej części łuku alpejskiego.', position: { x: 271, y: 252, chipWidth: 98 }, panelTags: ['W planach', 'Galeria wkrótce', 'Przyszły kierunek'] },
  { id: 'france', label: 'Francja', code: 'FR', type: 'country', status: 'future', shortDescription: 'Przyszły kierunek wypraw w zachodniej części łuku alpejskiego.', panelDescription: 'Kraj przyszłościowy do aktywacji przy kolejnych materiałach.', position: { x: 200, y: 176, chipWidth: 108 }, panelTags: ['Future', 'Galeria wkrótce', 'Przyszły kierunek'] },
  { id: 'norway', label: 'Norwegia', code: 'NO', type: 'country', status: 'future', shortDescription: 'Docelowy kierunek północny z naciskiem na surowy krajobraz i fiordy.', panelDescription: 'Kraj przyszłościowy, docelowo pod surowy klimat północy.', position: { x: 240, y: 72, chipWidth: 116 }, panelTags: ['Future', 'Północ', 'Przyszły kierunek'] },
  { id: 'spain', label: 'Hiszpania', code: 'ES', type: 'country', status: 'future', shortDescription: 'Południowo-zachodni kierunek atlasu, planowany na dalszy etap.', panelDescription: 'Kraj przyszłościowy do poszerzenia osi Europy o południowy zachód.', position: { x: 131, y: 236, chipWidth: 114 }, panelTags: ['Future', 'Galeria wkrótce', 'Przyszły kierunek'] },
  { id: 'romania', label: 'Rumunia', code: 'RO', type: 'country', status: 'planned', shortDescription: 'Planowany etap karpacki, naturalne rozszerzenie osi górskich Europy.', panelDescription: 'Kraj planowany pod rozwój kierunku karpackiego.', position: { x: 398, y: 186, chipWidth: 118 }, panelTags: ['W planach', 'Karpaty', 'Przyszły kierunek'] },
  { id: 'greece', label: 'Grecja', code: 'GR', type: 'country', status: 'future', shortDescription: 'Kierunek południowo-bałkański przygotowany pod przyszłe wyprawy.', panelDescription: 'Kraj przyszłościowy rozszerzający zakres wypraw o południe Europy.', position: { x: 376, y: 276, chipWidth: 102 }, panelTags: ['Future', 'Bałkany', 'Przyszły kierunek'] },
  { id: 'liechtenstein', label: 'Liechtenstein', code: 'LI', type: 'microstate', status: 'planned', shortDescription: 'Mały kraj alpejski przewidziany jako punkt specjalny atlasu.', panelDescription: 'Mikropaństwo planowane jako subtelny punkt premium w osi alpejskiej.', position: { x: 256, y: 181, chipWidth: 132 }, labelOffset: { x: -26, y: -16 }, panelTags: ['Microstate', 'W planach', 'Alpy'] },
  { id: 'tatry', label: 'Tatry', code: 'TAT', type: 'region', status: 'active', shortDescription: 'Aktywny region specjalny między Polską i Słowacją.', panelDescription: 'Aktywny region specjalny z ikoną gór i przejściem do widoku Tatr.', position: { x: 336, y: 146, chipWidth: 96 }, panelTags: ['Aktywny region', 'Przejście do mapy Tatr', 'Oś wypraw'], routeTarget: 'tatry' },
]

export const europeDefaultNodeId = 'europe'
