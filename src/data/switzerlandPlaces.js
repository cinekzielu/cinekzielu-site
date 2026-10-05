// Existing Swiss film destinations. Coordinates: swisstopo gazetteer, 2026-10-04.
// Label anchors are separate from geographic dots; no route or GPS track is inferred.
export const switzerlandPlaces = [
  {
    "id": "saxer-lucke",
    "name": "Saxer Lücke",
    "kind": "Przełęcz",
    "icon": "mountain",
    "parent": "switzerland",
    "view": "switzerland",
    "lat": 47.24729537963867,
    "lon": 9.42476749420166,
    "filmIds": [
      "BZOKvQHvtCk"
    ],
    "sequence": 1,
    "description": "Saxer Lücke — pierwszy film ze Szwajcarii.",
    "anchor": [
      76,
      34
    ],
    "compactAnchor": [
      80,
      29
    ],
    "coordinateSource": "https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=Saxerl%C3%BCcke&type=locations&origins=gazetteer&limit=5",
    "coordinateRecord": 118908
  },
  {
    "id": "fronalpstock",
    "name": "Fronalpstock",
    "kind": "Szczyt",
    "icon": "mountain",
    "parent": "switzerland",
    "view": "switzerland",
    "lat": 46.968204498291016,
    "lon": 8.637279510498047,
    "filmIds": [
      "KuZoxTnOmLs"
    ],
    "sequence": 2,
    "description": "Grań Fronalpstock. Drugi odcinek serii.",
    "anchor": [
      63,
      44
    ],
    "compactAnchor": [
      60,
      39
    ],
    "coordinateSource": "https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=Fronalpstock%20Morschach&type=locations&origins=gazetteer&limit=10",
    "coordinateRecord": 341831
  },
  {
    "id": "augstmatthorn",
    "name": "Augstmatthorn",
    "kind": "Szczyt",
    "icon": "mountain",
    "parent": "switzerland",
    "view": "switzerland",
    "lat": 46.74225997924805,
    "lon": 7.92861270904541,
    "filmIds": [
      "1b1K6CUmHMI"
    ],
    "sequence": 3,
    "description": "Augstmatthorn — trzeci odcinek serii.",
    "anchor": [
      43,
      49
    ],
    "compactAnchor": [
      34,
      43
    ],
    "coordinateSource": "https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=Augstmatthorn&type=locations&origins=gazetteer&limit=5",
    "coordinateRecord": 64512
  },
  {
    "id": "murren-gimmelwald",
    "name": "Mürren–Gimmelwald",
    "kind": "Via ferrata",
    "icon": "route",
    "parent": "switzerland",
    "view": "switzerland",
    "lat": 46.55961990356445,
    "lon": 7.891746997833252,
    "filmIds": [
      "qOHEK1qbjIU"
    ],
    "sequence": 4,
    "description": "Via ferrata z Mürren do Gimmelwaldu. Punkt oznacza miejscowość Mürren.",
    "anchor": [
      37,
      66
    ],
    "compactAnchor": [
      24,
      65
    ],
    "coordinateSource": "https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=M%C3%BCrren&type=locations&origins=gazetteer&limit=5",
    "coordinateRecord": 55210
  },
  {
    "id": "zermatt",
    "name": "Zermatt",
    "kind": "Miejscowość",
    "icon": "lakes",
    "parent": "switzerland",
    "view": "switzerland",
    "lat": 46.01753616333008,
    "lon": 7.746568202972412,
    "filmIds": [
      "nt6Upyoop1g"
    ],
    "sequence": 5,
    "description": "Zermatt i Szlak Pięciu Jezior z widokiem na Matterhorn.",
    "anchor": [
      40,
      86
    ],
    "compactAnchor": [
      40,
      95
    ],
    "coordinateSource": "https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=Zermatt&type=locations&origins=gazetteer&limit=5",
    "coordinateRecord": 413112
  },
  {
    "id": "bettmerhorn",
    "name": "Bettmerhorn",
    "kind": "Szczyt",
    "icon": "glacier",
    "parent": "switzerland",
    "view": "switzerland",
    "lat": 46.41791534423828,
    "lon": 8.082494735717773,
    "filmIds": [
      "ksi5aauYYBo"
    ],
    "sequence": 6,
    "description": "Bettmerhorn i lodowiec Aletsch — szósty odcinek serii.",
    "anchor": [
      56,
      71
    ],
    "compactAnchor": [
      65,
      75
    ],
    "coordinateSource": "https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=Bettmerhorn&type=locations&origins=gazetteer&limit=5",
    "coordinateRecord": 396139
  }
]

export const switzerlandPosition = ({lat,lon}) => ({x:(lon-5.5)*150/800*100,y:(48.25-lat)*220/600*100})
