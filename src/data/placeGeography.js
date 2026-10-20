import { supplementalSummitPlaces } from './supplementalSummitPlaces.js'
import { tatryLocations } from './tatryAtlas.js'
import { switzerlandPlaces } from './switzerlandPlaces.js'
import { moroccoPlaces } from './moroccoPlaces.js'
import { sicilyPlaces, hungaryPlaces } from './summer2026Places.js'
import { alpsCountryIds, alpsPlaces } from './alpsPlaces.js'

// Country membership of the existing sourced points. Border summits can belong
// to both countries; the same film/gallery is still counted only once per view.
const border = ['rysy','swinica','mieguszowiecki-szczyt-wielki','szpiglasowy-wierch','walentkowy-wierch','starorobocianski-wierch','wolowiec','grzes','rakon','kasprowy-wierch','malolaczniak','ciemniak','kopa-kondracka']
export const countryPlaceIds = {
  italy:sicilyPlaces.map(place => place.id),
  hungary:hungaryPlaces.map(place => place.id),
  poland:['giewont','koscielec','turbacz',...border],
  slovakia:tatryLocations.filter(point => !['giewont','koscielec'].includes(point.id)).map(point => point.id),
  ...Object.fromEntries(alpsCountryIds.map(id => [id, alpsPlaces.filter(place => place.parent === id).map(place => place.id)])),
  switzerland:[...supplementalSummitPlaces.filter(p => p.parent === 'switzerland').map(p => p.id), ...switzerlandPlaces.map(place => place.id), ...alpsPlaces.filter(place => place.parent === 'switzerland').map(place => place.id)],
  morocco:moroccoPlaces.map(place => place.id),
}
