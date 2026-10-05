import { tatryLocations } from './tatryAtlas.js'
import { switzerlandPlaces } from './switzerlandPlaces.js'
import { moroccoPlaces } from './moroccoPlaces.js'

// Country membership of the existing sourced points. Border summits can belong
// to both countries; the same film/gallery is still counted only once per view.
const border = ['rysy','swinica','mieguszowiecki-szczyt-wielki','szpiglasowy-wierch','walentkowy-wierch','starorobocianski-wierch','wolowiec']
export const countryPlaceIds = {
  poland:['giewont','koscielec',...border],
  slovakia:tatryLocations.filter(point => !['giewont','koscielec'].includes(point.id)).map(point => point.id),
  switzerland:switzerlandPlaces.map(place => place.id),
  morocco:moroccoPlaces.map(place => place.id),
}
