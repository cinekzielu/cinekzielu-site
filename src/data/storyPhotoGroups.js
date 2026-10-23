import { galleryData } from './galleryData.js'
import { storyPhotoAssets } from './storyPhotoAssets.js'

const groups = {
  "przed-triglavem": {
    "title": "Przed pierwszym wejściem",
    "dateLabel": "17 sierpnia 2026",
    "date": "2026-08-17",
    "endDate": null,
    "refs": [
      "alpy-3",
      "alpy-7"
    ]
  },
  "triglav": {
    "title": "Triglav",
    "dateLabel": "18 sierpnia 2026",
    "date": "2026-08-18",
    "endDate": null,
    "refs": [
      {
        "gallery": "alpy-2026",
        "number": 4
      },
      {
        "gallery": "alpy-2026",
        "number": 2
      },
      "alpy-26",
      {
        "gallery": "alpy-2026",
        "number": 5
      },
      "alpy-34",
      "alpy-39",
      {
        "gallery": "alpy-2026",
        "number": 6
      },
      "alpy-46",
      {
        "gallery": "alpy-2026",
        "number": 7
      },
      "alpy-49",
      {
        "gallery": "alpy-2026",
        "number": 8
      }
    ]
  },
  "po-triglavie": {
    "title": "Po Triglavie",
    "dateLabel": "18 sierpnia 2026 · po zejściu",
    "date": "2026-08-18",
    "endDate": null,
    "refs": [
      "alpy-52"
    ]
  },
  "grossglockner": {
    "title": "Grossglockner",
    "dateLabel": "19 sierpnia 2026",
    "date": "2026-08-19",
    "endDate": null,
    "refs": [
      "alpy-55",
      {
        "gallery": "alpy-2026",
        "number": 9
      },
      {
        "gallery": "alpy-2026",
        "number": 10
      },
      "alpy-73",
      {
        "gallery": "alpy-2026",
        "number": 11
      },
      "alpy-82",
      "alpy-87",
      "alpy-90"
    ]
  },
  "przerwa-austria": {
    "title": "Między Austrią a Szwajcarią",
    "dateLabel": "20–21 sierpnia 2026",
    "date": "2026-08-20",
    "endDate": "2026-08-21",
    "refs": [
      {
        "gallery": "alpy-2026",
        "number": 12
      },
      "alpy-105",
      "alpy-110",
      {
        "gallery": "alpy-2026",
        "number": 13
      }
    ]
  },
  "dufour-podejscie": {
    "title": "Dufourspitze · podejście",
    "dateLabel": "22 sierpnia 2026",
    "date": "2026-08-22",
    "endDate": null,
    "refs": [
      {
        "gallery": "alpy-2026",
        "number": 3
      },
      "alpy-129",
      {
        "gallery": "alpy-2026",
        "number": 14
      },
      {
        "gallery": "alpy-2026",
        "number": 15
      },
      {
        "gallery": "alpy-2026",
        "number": 16
      },
      "alpy-133",
      {
        "gallery": "alpy-2026",
        "number": 1
      },
      {
        "gallery": "alpy-2026",
        "number": 17
      },
      {
        "gallery": "alpy-2026",
        "number": 18
      },
      {
        "gallery": "alpy-2026",
        "number": 19
      },
      {
        "gallery": "alpy-2026",
        "number": 20
      },
      "alpy-141",
      {
        "gallery": "alpy-2026",
        "number": 21
      },
      {
        "gallery": "alpy-2026",
        "number": 22
      }
    ]
  },
  "dufour-szczyt": {
    "title": "Dufourspitze · dzień szczytowy",
    "dateLabel": "23 sierpnia 2026",
    "date": "2026-08-23",
    "endDate": null,
    "refs": [
      "alpy-145",
      {
        "gallery": "alpy-2026",
        "number": 23
      },
      {
        "gallery": "alpy-2026",
        "number": 24
      },
      "alpy-149",
      {
        "gallery": "alpy-2026",
        "number": 25
      },
      "alpy-153",
      {
        "gallery": "alpy-2026",
        "number": 26
      },
      {
        "gallery": "alpy-2026",
        "number": 27
      },
      {
        "gallery": "alpy-2026",
        "number": 28
      },
      {
        "gallery": "alpy-2026",
        "number": 29
      },
      "alpy-159",
      {
        "gallery": "alpy-2026",
        "number": 30
      },
      {
        "gallery": "alpy-2026",
        "number": 31
      },
      {
        "gallery": "alpy-2026",
        "number": 32
      },
      {
        "gallery": "alpy-2026",
        "number": 33
      }
    ]
  },
  "dufour-powrot": {
    "title": "Dufourspitze · powrót",
    "dateLabel": "24 sierpnia 2026",
    "date": "2026-08-24",
    "endDate": null,
    "refs": [
      "alpy-163",
      {
        "gallery": "alpy-2026",
        "number": 34
      },
      "alpy-166",
      {
        "gallery": "alpy-2026",
        "number": 35
      },
      {
        "gallery": "alpy-2026",
        "number": 36
      },
      {
        "gallery": "alpy-2026",
        "number": 37
      },
      {
        "gallery": "alpy-2026",
        "number": 38
      },
      "alpy-170",
      {
        "gallery": "alpy-2026",
        "number": 39
      }
    ]
  },
  "przerwa-szwajcaria": {
    "title": "Przerwa po Dufourspitze",
    "dateLabel": "25 sierpnia 2026",
    "date": "2026-08-25",
    "endDate": null,
    "refs": [
      "alpy-184",
      "alpy-186",
      {
        "gallery": "alpy-2026",
        "number": 40
      },
      {
        "gallery": "alpy-2026",
        "number": 41
      },
      {
        "gallery": "alpy-2026",
        "number": 42
      }
    ]
  },
  "grauspitz": {
    "title": "Grauspitz",
    "dateLabel": "26 sierpnia 2026",
    "date": "2026-08-26",
    "endDate": null,
    "refs": [
      {
        "gallery": "alpy-2026",
        "number": 43
      },
      "alpy-200",
      "alpy-207",
      "alpy-211",
      "alpy-212",
      {
        "gallery": "alpy-2026",
        "number": 44
      },
      {
        "gallery": "alpy-2026",
        "number": 45
      },
      {
        "gallery": "alpy-2026",
        "number": 46
      }
    ]
  },
  "przed-zugspitze": {
    "title": "Przed Zugspitze",
    "dateLabel": "27 sierpnia 2026",
    "date": "2026-08-27",
    "endDate": null,
    "refs": [
      "alpy-217",
      "alpy-234"
    ]
  },
  "zugspitze": {
    "title": "Zugspitze",
    "dateLabel": "28 sierpnia 2026",
    "date": "2026-08-28",
    "endDate": null,
    "refs": [
      "alpy-236",
      {
        "gallery": "alpy-2026",
        "number": 47
      },
      "alpy-250",
      {
        "gallery": "alpy-2026",
        "number": 48
      },
      "alpy-253",
      "alpy-257",
      "alpy-267"
    ]
  }
}
const resolve = ref => typeof ref === 'string' ? storyPhotoAssets[ref] : galleryData.find(gallery => gallery.id === ref.gallery).photos[ref.number - 1]
export const alpsPhotoStory = Object.fromEntries(Object.entries(groups).map(([id, group]) => {const {refs,...details}=group;return [id,{id,...details,photos:refs.map(resolve)}]}))

const baranieGroups = [
  {
    "id": "baranie-dzien-1",
    "title": "Baranie Rogi",
    "dateLabel": "4 lipca 2026 · dzień 1",
    "date": "2026-07-04",
    "description": "Podejście, skalne odcinki i powrót pod koniec dnia.",
    "refs": [
      "baranie-22",
      "baranie-28",
      "baranie-29",
      "baranie-39",
      "baranie-43",
      "baranie-51"
    ]
  },
  {
    "id": "baranie-dzien-2",
    "title": "Lodowy Szczyt przez Lodową Kopę",
    "dateLabel": "5 lipca 2026 · dzień 2",
    "date": "2026-07-05",
    "description": "Fotografie z poranka drugiego dnia: grań i wschód słońca.",
    "refs": [
      "baranie-57",
      "baranie-60"
    ]
  }
]
export const baraniePhotoStory = baranieGroups.map(({refs,...group})=>({...group,photos:refs.map(resolve)}))
