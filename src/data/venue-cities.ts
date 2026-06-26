// Major Vietnamese cities with coordinates for weather lookup
export interface VenueCity {
  id: string;
  nameVi: string;
  nameEn: string;
  lat: number;
  lon: number;
}

export const VENUE_CITIES: VenueCity[] = [
  { id: "hcmc", nameVi: "TP. Hồ Chí Minh", nameEn: "Ho Chi Minh City", lat: 10.8231, lon: 106.6297 },
  { id: "hanoi", nameVi: "Hà Nội", nameEn: "Hanoi", lat: 21.0278, lon: 105.8342 },
  { id: "danang", nameVi: "Đà Nẵng", nameEn: "Da Nang", lat: 16.0544, lon: 108.2022 },
  { id: "haiphong", nameVi: "Hải Phòng", nameEn: "Hai Phong", lat: 20.8449, lon: 106.6881 },
  { id: "cantho", nameVi: "Cần Thơ", nameEn: "Can Tho", lat: 10.0452, lon: 105.7469 },
  { id: "nhatrang", nameVi: "Nha Trang", nameEn: "Nha Trang", lat: 12.2388, lon: 109.1967 },
  { id: "dalat", nameVi: "Đà Lạt", nameEn: "Da Lat", lat: 11.9404, lon: 108.4583 },
  { id: "hue", nameVi: "Huế", nameEn: "Hue", lat: 16.4637, lon: 107.5909 },
  { id: "vungtau", nameVi: "Vũng Tàu", nameEn: "Vung Tau", lat: 10.4114, lon: 107.1362 },
  { id: "quangninh", nameVi: "Quảng Ninh", nameEn: "Quang Ninh", lat: 20.9517, lon: 107.0631 },
  { id: "binhduong", nameVi: "Bình Dương", nameEn: "Binh Duong", lat: 10.9804, lon: 106.6519 },
  { id: "dongnai", nameVi: "Đồng Nai", nameEn: "Dong Nai", lat: 10.9453, lon: 106.8234 },
  { id: "lamdong", nameVi: "Lâm Đồng", nameEn: "Lam Dong", lat: 11.9404, lon: 108.4583 },
  { id: "thanhhoa", nameVi: "Thanh Hóa", nameEn: "Thanh Hoa", lat: 19.8067, lon: 105.7854 },
  { id: "nghean", nameVi: "Nghệ An", nameEn: "Nghe An", lat: 18.6796, lon: 105.6817 },
];

export const DEFAULT_CITY_ID = "hcmc";

export function getVenueCity(cityId: string): VenueCity | undefined {
  return VENUE_CITIES.find((c) => c.id === cityId);
}

export function getVenueCityOrDefault(cityId: string): VenueCity {
  return getVenueCity(cityId) ?? getVenueCity(DEFAULT_CITY_ID)!;
}
