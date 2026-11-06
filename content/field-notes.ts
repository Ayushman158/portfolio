// Six to ten landscapes or places, with no people. Put the warmest sunset photos
// first and last, and the fog and haze in the middle. Files go in
// /public/field-notes/. The section stays hidden until this list has entries.
//
// { src: '/field-notes/01-fog-road.jpg', alt: 'A road going into fog', place: 'North Lakhimpur', month: 'Oct', time: '17:40', ratio: '3:2' }
export type FieldNote = {
  src: string
  alt: string
  place: string
  month: string
  time: string
  ratio: '4:5' | '3:2' // the photo's own shape; it is never cropped
}

export const fieldNotes: FieldNote[] = []
