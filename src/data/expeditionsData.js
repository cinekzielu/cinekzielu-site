const img = (name) => `/images/${name}`

export const expeditionsData = [
  {
    slug: 'lomnica-2634',
    title: 'Łomnica 2634 m',
    subtitle: 'Tatrzański klasyk w surowym świetle poranka',
    location: 'Tatry Wysokie, Słowacja',
    type: 'Wyprawa górska / film',
    season: 'Sezon: wkrótce',
    mood: 'Trudność i klimat: wkrótce',
    heroImage: img('lomnica-thumb.png'),
    filmUrl: 'https://www.youtube.com/@cinek_zielu',
    shortDescription: 'Podejście pod Łomnicę z naciskiem na rytm drogi, warunki i ujęcia oddające skalę masywu.',
    longDescription:
      'Ta historia buduje się od pierwszych kroków: chłodne powietrze, cichy start i narastające tempo podejścia. Łomnica to dla mnie materiał o koncentracji i konsekwencji — o przejściu od spokojnego marszu do fragmentów, w których każdy ruch ma znaczenie. Filmowo to mieszanka szerokich planów i bliskich, surowych kadrów z trasy.',
    stats: {
      height: '2634 m n.p.m.',
      region: 'Tatry Wysokie',
      filmFormat: 'Vlog / cinematic edit',
    },
    tags: ['Tatry', 'Szczyt', 'Wejście', 'Cinematic'],
    gallery: ['Galeria podejścia — wkrótce', 'Trasa GPX — wkrótce'],
  },
  {
    slug: 'koscielec-zima',
    title: 'Kościelec zimą',
    subtitle: 'Mróz, ekspozycja i skupienie na każdym kroku',
    location: 'Tatry, Polska',
    type: 'Zimowa wyprawa / short film',
    season: 'Sezon: zima — szczegóły wkrótce',
    mood: 'Trudność i klimat: technicznie, surowo',
    heroImage: img('koscielec-thumb.jpg'),
    filmUrl: 'https://www.youtube.com/@cinek_zielu',
    shortDescription: 'Zimowe wejście na Kościelec pokazane przez warunki, emocje i pracę kamery w trudnym terenie.',
    longDescription:
      'Kościelec zimą ma zupełnie inny charakter niż letnie wyjścia. Śnieg, lód i wiatr zmieniają tempo, a każdy odcinek trasy wymaga większej uwagi. W tej historii najważniejsze są detale: oddech, dźwięk raków, krótkie postoje i momenty, kiedy panorama otwiera się nagle po intensywnym podejściu. To materiał o zimowej dyscyplinie i satysfakcji na końcu dnia.',
    stats: {
      height: '2155 m n.p.m.',
      region: 'Tatry Polskie',
      filmFormat: 'Expedition short',
    },
    tags: ['Zima', 'Kościelec', 'Tatry', 'Alpinizm'],
    gallery: ['Galeria zimowa — wkrótce', 'Opis wariantów trasy — wkrótce'],
  },
  {
    slug: 'maroko-czesc-1',
    title: 'Maroko cz. 1',
    subtitle: 'Pierwszy etap trekkingu i kontrast krajobrazów',
    location: 'Atlas, Maroko',
    type: 'Podróż / trekking / film',
    season: 'Sezon: wkrótce',
    mood: 'Trudność i klimat: zmienne tempo, ciepłe światło',
    heroImage: img('maroko-thumb.png'),
    filmUrl: 'https://www.youtube.com/@cinek_zielu',
    shortDescription: 'Początek marokańskiej historii: trekking, codzienność w trasie i mocny kontrast światła.',
    longDescription:
      'Maroko od pierwszego dnia narzuca własny rytm: inne kolory, inne światło i zupełnie inne tempo drogi. W części pierwszej skupiam się na wejściu w miejsce — od przygotowania po pierwsze odcinki trekkingu. To opowieść o zmianie perspektywy i o tym, jak podróż wpływa na sposób filmowania, kiedy każdy kadr wymaga nowego spojrzenia.',
    stats: {
      height: 'Wysokość: zależnie od etapu',
      region: 'Góry Atlas',
      filmFormat: 'Travel documentary',
    },
    tags: ['Maroko', 'Atlas', 'Trekking', 'Travel film'],
    gallery: ['Galeria z etapu 1 — wkrótce', 'Mapa trasy — wkrótce'],
  },
]
