/**
 * Regional Scope Utilities for Pulse Benchmarks
 *
 * Spec: Phase 1 Plan, Task 1
 * Decision: Metro area (MSA) with fallback to state if <50 peers
 *
 * Maps cities to Metropolitan Statistical Areas (MSAs) for peer grouping.
 * The hierarchy is: City -> Metro Area (MSA) -> State -> National
 *
 * Source: US Census Bureau Core Based Statistical Areas (CBSAs)
 * https://www.census.gov/programs-surveys/metro-micro/about/delineation-files.html
 */

/**
 * Region type for peer group scoping.
 * "metro" = MSA (Metropolitan Statistical Area)
 * "state" = US State (fallback when metro has insufficient peers)
 * "national" = All US (fallback of last resort)
 */
export type RegionType = "metro" | "state" | "national";

export interface Region {
  type: RegionType;
  code: string;
  name: string;
}

/**
 * Top 50 Metropolitan Statistical Areas by population (2020 Census)
 * Maps city names to their MSA codes and names.
 *
 * MSA codes are the official CBSA FIPS codes from US Census Bureau.
 * We use these for consistent peer grouping across the platform.
 */
const MSA_LOOKUP: Record<string, { code: string; name: string }> = {
  // New York-Newark-Jersey City, NY-NJ-PA
  "new york": { code: "35620", name: "New York-Newark-Jersey City" },
  manhattan: { code: "35620", name: "New York-Newark-Jersey City" },
  brooklyn: { code: "35620", name: "New York-Newark-Jersey City" },
  queens: { code: "35620", name: "New York-Newark-Jersey City" },
  bronx: { code: "35620", name: "New York-Newark-Jersey City" },
  "staten island": { code: "35620", name: "New York-Newark-Jersey City" },
  newark: { code: "35620", name: "New York-Newark-Jersey City" },
  "jersey city": { code: "35620", name: "New York-Newark-Jersey City" },

  // Los Angeles-Long Beach-Anaheim, CA
  "los angeles": { code: "31080", name: "Los Angeles-Long Beach-Anaheim" },
  "long beach": { code: "31080", name: "Los Angeles-Long Beach-Anaheim" },
  anaheim: { code: "31080", name: "Los Angeles-Long Beach-Anaheim" },
  "santa monica": { code: "31080", name: "Los Angeles-Long Beach-Anaheim" },
  pasadena: { code: "31080", name: "Los Angeles-Long Beach-Anaheim" },
  glendale: { code: "31080", name: "Los Angeles-Long Beach-Anaheim" },
  burbank: { code: "31080", name: "Los Angeles-Long Beach-Anaheim" },

  // Chicago-Naperville-Elgin, IL-IN-WI
  chicago: { code: "16980", name: "Chicago-Naperville-Elgin" },
  naperville: { code: "16980", name: "Chicago-Naperville-Elgin" },
  elgin: { code: "16980", name: "Chicago-Naperville-Elgin" },
  evanston: { code: "16980", name: "Chicago-Naperville-Elgin" },
  aurora: { code: "16980", name: "Chicago-Naperville-Elgin" },

  // Dallas-Fort Worth-Arlington, TX
  dallas: { code: "19100", name: "Dallas-Fort Worth-Arlington" },
  "fort worth": { code: "19100", name: "Dallas-Fort Worth-Arlington" },
  arlington: { code: "19100", name: "Dallas-Fort Worth-Arlington" },
  plano: { code: "19100", name: "Dallas-Fort Worth-Arlington" },
  irving: { code: "19100", name: "Dallas-Fort Worth-Arlington" },
  frisco: { code: "19100", name: "Dallas-Fort Worth-Arlington" },

  // Houston-The Woodlands-Sugar Land, TX
  houston: { code: "26420", name: "Houston-The Woodlands-Sugar Land" },
  "the woodlands": { code: "26420", name: "Houston-The Woodlands-Sugar Land" },
  "sugar land": { code: "26420", name: "Houston-The Woodlands-Sugar Land" },
  katy: { code: "26420", name: "Houston-The Woodlands-Sugar Land" },
  pearland: { code: "26420", name: "Houston-The Woodlands-Sugar Land" },

  // Washington-Arlington-Alexandria, DC-VA-MD-WV
  washington: { code: "47900", name: "Washington-Arlington-Alexandria" },
  "washington dc": { code: "47900", name: "Washington-Arlington-Alexandria" },
  dc: { code: "47900", name: "Washington-Arlington-Alexandria" },
  alexandria: { code: "47900", name: "Washington-Arlington-Alexandria" },
  bethesda: { code: "47900", name: "Washington-Arlington-Alexandria" },
  "silver spring": { code: "47900", name: "Washington-Arlington-Alexandria" },

  // Miami-Fort Lauderdale-West Palm Beach, FL
  miami: { code: "33100", name: "Miami-Fort Lauderdale-West Palm Beach" },
  "fort lauderdale": { code: "33100", name: "Miami-Fort Lauderdale-West Palm Beach" },
  "west palm beach": { code: "33100", name: "Miami-Fort Lauderdale-West Palm Beach" },
  "miami beach": { code: "33100", name: "Miami-Fort Lauderdale-West Palm Beach" },
  boca: { code: "33100", name: "Miami-Fort Lauderdale-West Palm Beach" },
  "boca raton": { code: "33100", name: "Miami-Fort Lauderdale-West Palm Beach" },

  // Philadelphia-Camden-Wilmington, PA-NJ-DE-MD
  philadelphia: { code: "37980", name: "Philadelphia-Camden-Wilmington" },
  camden: { code: "37980", name: "Philadelphia-Camden-Wilmington" },
  wilmington: { code: "37980", name: "Philadelphia-Camden-Wilmington" },

  // Atlanta-Sandy Springs-Roswell, GA
  atlanta: { code: "12060", name: "Atlanta-Sandy Springs-Roswell" },
  "sandy springs": { code: "12060", name: "Atlanta-Sandy Springs-Roswell" },
  roswell: { code: "12060", name: "Atlanta-Sandy Springs-Roswell" },
  marietta: { code: "12060", name: "Atlanta-Sandy Springs-Roswell" },
  decatur: { code: "12060", name: "Atlanta-Sandy Springs-Roswell" },

  // Phoenix-Mesa-Scottsdale, AZ
  phoenix: { code: "38060", name: "Phoenix-Mesa-Scottsdale" },
  mesa: { code: "38060", name: "Phoenix-Mesa-Scottsdale" },
  scottsdale: { code: "38060", name: "Phoenix-Mesa-Scottsdale" },
  tempe: { code: "38060", name: "Phoenix-Mesa-Scottsdale" },
  chandler: { code: "38060", name: "Phoenix-Mesa-Scottsdale" },

  // Boston-Cambridge-Newton, MA-NH
  boston: { code: "14460", name: "Boston-Cambridge-Newton" },
  cambridge: { code: "14460", name: "Boston-Cambridge-Newton" },
  newton: { code: "14460", name: "Boston-Cambridge-Newton" },
  somerville: { code: "14460", name: "Boston-Cambridge-Newton" },
  brookline: { code: "14460", name: "Boston-Cambridge-Newton" },

  // San Francisco-Oakland-Hayward, CA
  "san francisco": { code: "41860", name: "San Francisco-Oakland-Hayward" },
  oakland: { code: "41860", name: "San Francisco-Oakland-Hayward" },
  berkeley: { code: "41860", name: "San Francisco-Oakland-Hayward" },
  fremont: { code: "41860", name: "San Francisco-Oakland-Hayward" },

  // Riverside-San Bernardino-Ontario, CA
  riverside: { code: "40140", name: "Riverside-San Bernardino-Ontario" },
  "san bernardino": { code: "40140", name: "Riverside-San Bernardino-Ontario" },
  ontario: { code: "40140", name: "Riverside-San Bernardino-Ontario" },

  // Detroit-Warren-Dearborn, MI
  detroit: { code: "19820", name: "Detroit-Warren-Dearborn" },
  warren: { code: "19820", name: "Detroit-Warren-Dearborn" },
  dearborn: { code: "19820", name: "Detroit-Warren-Dearborn" },
  "ann arbor": { code: "11460", name: "Ann Arbor" },

  // Seattle-Tacoma-Bellevue, WA
  seattle: { code: "42660", name: "Seattle-Tacoma-Bellevue" },
  tacoma: { code: "42660", name: "Seattle-Tacoma-Bellevue" },
  bellevue: { code: "42660", name: "Seattle-Tacoma-Bellevue" },
  kirkland: { code: "42660", name: "Seattle-Tacoma-Bellevue" },
  redmond: { code: "42660", name: "Seattle-Tacoma-Bellevue" },

  // Minneapolis-St. Paul-Bloomington, MN-WI
  minneapolis: { code: "33460", name: "Minneapolis-St. Paul-Bloomington" },
  "st paul": { code: "33460", name: "Minneapolis-St. Paul-Bloomington" },
  "saint paul": { code: "33460", name: "Minneapolis-St. Paul-Bloomington" },
  bloomington: { code: "33460", name: "Minneapolis-St. Paul-Bloomington" },

  // San Diego-Carlsbad, CA
  "san diego": { code: "41740", name: "San Diego-Carlsbad" },
  carlsbad: { code: "41740", name: "San Diego-Carlsbad" },
  "la jolla": { code: "41740", name: "San Diego-Carlsbad" },
  chula: { code: "41740", name: "San Diego-Carlsbad" },
  "chula vista": { code: "41740", name: "San Diego-Carlsbad" },

  // Tampa-St. Petersburg-Clearwater, FL
  tampa: { code: "45300", name: "Tampa-St. Petersburg-Clearwater" },
  "st petersburg": { code: "45300", name: "Tampa-St. Petersburg-Clearwater" },
  clearwater: { code: "45300", name: "Tampa-St. Petersburg-Clearwater" },

  // Denver-Aurora-Lakewood, CO
  denver: { code: "19740", name: "Denver-Aurora-Lakewood" },
  boulder: { code: "14500", name: "Boulder" },
  lakewood: { code: "19740", name: "Denver-Aurora-Lakewood" },

  // St. Louis, MO-IL
  "st louis": { code: "41180", name: "St. Louis" },
  "saint louis": { code: "41180", name: "St. Louis" },

  // Baltimore-Columbia-Towson, MD
  baltimore: { code: "12580", name: "Baltimore-Columbia-Towson" },
  columbia: { code: "12580", name: "Baltimore-Columbia-Towson" },

  // Orlando-Kissimmee-Sanford, FL
  orlando: { code: "36740", name: "Orlando-Kissimmee-Sanford" },
  kissimmee: { code: "36740", name: "Orlando-Kissimmee-Sanford" },

  // Charlotte-Concord-Gastonia, NC-SC
  charlotte: { code: "16740", name: "Charlotte-Concord-Gastonia" },

  // San Antonio-New Braunfels, TX
  "san antonio": { code: "41700", name: "San Antonio-New Braunfels" },

  // Portland-Vancouver-Hillsboro, OR-WA
  portland: { code: "38900", name: "Portland-Vancouver-Hillsboro" },
  hillsboro: { code: "38900", name: "Portland-Vancouver-Hillsboro" },

  // Sacramento--Roseville--Arden-Arcade, CA
  sacramento: { code: "40900", name: "Sacramento-Roseville" },
  roseville: { code: "40900", name: "Sacramento-Roseville" },

  // Pittsburgh, PA
  pittsburgh: { code: "38300", name: "Pittsburgh" },

  // Las Vegas-Henderson-Paradise, NV
  "las vegas": { code: "29820", name: "Las Vegas-Henderson-Paradise" },
  vegas: { code: "29820", name: "Las Vegas-Henderson-Paradise" },
  henderson: { code: "29820", name: "Las Vegas-Henderson-Paradise" },

  // Austin-Round Rock, TX
  austin: { code: "12420", name: "Austin-Round Rock" },
  "round rock": { code: "12420", name: "Austin-Round Rock" },

  // Cincinnati, OH-KY-IN
  cincinnati: { code: "17140", name: "Cincinnati" },

  // Kansas City, MO-KS
  "kansas city": { code: "28140", name: "Kansas City" },

  // Columbus, OH
  columbus: { code: "18140", name: "Columbus" },

  // Indianapolis-Carmel-Anderson, IN
  indianapolis: { code: "26900", name: "Indianapolis-Carmel-Anderson" },
  carmel: { code: "26900", name: "Indianapolis-Carmel-Anderson" },

  // Cleveland-Elyria, OH
  cleveland: { code: "17460", name: "Cleveland-Elyria" },

  // San Jose-Sunnyvale-Santa Clara, CA
  "san jose": { code: "41940", name: "San Jose-Sunnyvale-Santa Clara" },
  sunnyvale: { code: "41940", name: "San Jose-Sunnyvale-Santa Clara" },
  "santa clara": { code: "41940", name: "San Jose-Sunnyvale-Santa Clara" },
  "palo alto": { code: "41940", name: "San Jose-Sunnyvale-Santa Clara" },
  "mountain view": { code: "41940", name: "San Jose-Sunnyvale-Santa Clara" },

  // Nashville-Davidson--Murfreesboro--Franklin, TN
  nashville: { code: "34980", name: "Nashville-Davidson-Murfreesboro-Franklin" },

  // Virginia Beach-Norfolk-Newport News, VA-NC
  "virginia beach": { code: "47260", name: "Virginia Beach-Norfolk-Newport News" },
  norfolk: { code: "47260", name: "Virginia Beach-Norfolk-Newport News" },

  // Providence-Warwick, RI-MA
  providence: { code: "39300", name: "Providence-Warwick" },

  // Milwaukee-Waukesha-West Allis, WI
  milwaukee: { code: "33340", name: "Milwaukee-Waukesha-West Allis" },

  // Jacksonville, FL
  jacksonville: { code: "27260", name: "Jacksonville" },

  // Memphis, TN-MS-AR
  memphis: { code: "32820", name: "Memphis" },

  // Oklahoma City, OK
  "oklahoma city": { code: "36420", name: "Oklahoma City" },

  // Louisville/Jefferson County, KY-IN
  louisville: { code: "31140", name: "Louisville/Jefferson County" },

  // Raleigh, NC
  raleigh: { code: "39580", name: "Raleigh" },
  durham: { code: "20500", name: "Durham-Chapel Hill" },
  "chapel hill": { code: "20500", name: "Durham-Chapel Hill" },

  // Richmond, VA
  richmond: { code: "40060", name: "Richmond" },

  // New Orleans-Metairie, LA
  "new orleans": { code: "35380", name: "New Orleans-Metairie" },

  // Salt Lake City, UT
  "salt lake city": { code: "41620", name: "Salt Lake City" },
  "salt lake": { code: "41620", name: "Salt Lake City" },

  // Birmingham-Hoover, AL
  birmingham: { code: "13820", name: "Birmingham-Hoover" },

  // Buffalo-Cheektowaga-Niagara Falls, NY
  buffalo: { code: "15380", name: "Buffalo-Cheektowaga-Niagara Falls" },

  // Hartford-West Hartford-East Hartford, CT
  hartford: { code: "25540", name: "Hartford-West Hartford-East Hartford" },

  // Rochester, NY
  rochester: { code: "40380", name: "Rochester" },
};

/**
 * US State FIPS codes
 */
const STATE_CODES: Record<string, { code: string; name: string }> = {
  al: { code: "01", name: "Alabama" },
  alabama: { code: "01", name: "Alabama" },
  ak: { code: "02", name: "Alaska" },
  alaska: { code: "02", name: "Alaska" },
  az: { code: "04", name: "Arizona" },
  arizona: { code: "04", name: "Arizona" },
  ar: { code: "05", name: "Arkansas" },
  arkansas: { code: "05", name: "Arkansas" },
  ca: { code: "06", name: "California" },
  california: { code: "06", name: "California" },
  co: { code: "08", name: "Colorado" },
  colorado: { code: "08", name: "Colorado" },
  ct: { code: "09", name: "Connecticut" },
  connecticut: { code: "09", name: "Connecticut" },
  de: { code: "10", name: "Delaware" },
  delaware: { code: "10", name: "Delaware" },
  dc: { code: "11", name: "District of Columbia" },
  fl: { code: "12", name: "Florida" },
  florida: { code: "12", name: "Florida" },
  ga: { code: "13", name: "Georgia" },
  georgia: { code: "13", name: "Georgia" },
  hi: { code: "15", name: "Hawaii" },
  hawaii: { code: "15", name: "Hawaii" },
  id: { code: "16", name: "Idaho" },
  idaho: { code: "16", name: "Idaho" },
  il: { code: "17", name: "Illinois" },
  illinois: { code: "17", name: "Illinois" },
  in: { code: "18", name: "Indiana" },
  indiana: { code: "18", name: "Indiana" },
  ia: { code: "19", name: "Iowa" },
  iowa: { code: "19", name: "Iowa" },
  ks: { code: "20", name: "Kansas" },
  kansas: { code: "20", name: "Kansas" },
  ky: { code: "21", name: "Kentucky" },
  kentucky: { code: "21", name: "Kentucky" },
  la: { code: "22", name: "Louisiana" },
  louisiana: { code: "22", name: "Louisiana" },
  me: { code: "23", name: "Maine" },
  maine: { code: "23", name: "Maine" },
  md: { code: "24", name: "Maryland" },
  maryland: { code: "24", name: "Maryland" },
  ma: { code: "25", name: "Massachusetts" },
  massachusetts: { code: "25", name: "Massachusetts" },
  mi: { code: "26", name: "Michigan" },
  michigan: { code: "26", name: "Michigan" },
  mn: { code: "27", name: "Minnesota" },
  minnesota: { code: "27", name: "Minnesota" },
  ms: { code: "28", name: "Mississippi" },
  mississippi: { code: "28", name: "Mississippi" },
  mo: { code: "29", name: "Missouri" },
  missouri: { code: "29", name: "Missouri" },
  mt: { code: "30", name: "Montana" },
  montana: { code: "30", name: "Montana" },
  ne: { code: "31", name: "Nebraska" },
  nebraska: { code: "31", name: "Nebraska" },
  nv: { code: "32", name: "Nevada" },
  nevada: { code: "32", name: "Nevada" },
  nh: { code: "33", name: "New Hampshire" },
  "new hampshire": { code: "33", name: "New Hampshire" },
  nj: { code: "34", name: "New Jersey" },
  "new jersey": { code: "34", name: "New Jersey" },
  nm: { code: "35", name: "New Mexico" },
  "new mexico": { code: "35", name: "New Mexico" },
  ny: { code: "36", name: "New York" },
  "new york state": { code: "36", name: "New York" },
  nc: { code: "37", name: "North Carolina" },
  "north carolina": { code: "37", name: "North Carolina" },
  nd: { code: "38", name: "North Dakota" },
  "north dakota": { code: "38", name: "North Dakota" },
  oh: { code: "39", name: "Ohio" },
  ohio: { code: "39", name: "Ohio" },
  ok: { code: "40", name: "Oklahoma" },
  oklahoma: { code: "40", name: "Oklahoma" },
  or: { code: "41", name: "Oregon" },
  oregon: { code: "41", name: "Oregon" },
  pa: { code: "42", name: "Pennsylvania" },
  pennsylvania: { code: "42", name: "Pennsylvania" },
  ri: { code: "44", name: "Rhode Island" },
  "rhode island": { code: "44", name: "Rhode Island" },
  sc: { code: "45", name: "South Carolina" },
  "south carolina": { code: "45", name: "South Carolina" },
  sd: { code: "46", name: "South Dakota" },
  "south dakota": { code: "46", name: "South Dakota" },
  tn: { code: "47", name: "Tennessee" },
  tennessee: { code: "47", name: "Tennessee" },
  tx: { code: "48", name: "Texas" },
  texas: { code: "48", name: "Texas" },
  ut: { code: "49", name: "Utah" },
  utah: { code: "49", name: "Utah" },
  vt: { code: "50", name: "Vermont" },
  vermont: { code: "50", name: "Vermont" },
  va: { code: "51", name: "Virginia" },
  virginia: { code: "51", name: "Virginia" },
  wa: { code: "53", name: "Washington" },
  washington: { code: "53", name: "Washington" },
  wv: { code: "54", name: "West Virginia" },
  "west virginia": { code: "54", name: "West Virginia" },
  wi: { code: "55", name: "Wisconsin" },
  wisconsin: { code: "55", name: "Wisconsin" },
  wy: { code: "56", name: "Wyoming" },
  wyoming: { code: "56", name: "Wyoming" },
};

/**
 * Get the region for a business based on city and state.
 * Returns the most specific region available (metro > state > national).
 *
 * @param city - The city name (case-insensitive)
 * @param state - The state name or abbreviation (case-insensitive)
 * @returns Region object with type, code, and human-readable name
 */
export function getRegion(city: string, state: string): Region {
  const normalizedCity = city.toLowerCase().trim();
  const normalizedState = state.toLowerCase().trim();

  // Try to find MSA first (most specific)
  const msa = MSA_LOOKUP[normalizedCity];
  if (msa) {
    return {
      type: "metro",
      code: msa.code,
      name: msa.name,
    };
  }

  // Fall back to state
  const stateData = STATE_CODES[normalizedState];
  if (stateData) {
    return {
      type: "state",
      code: stateData.code,
      name: stateData.name,
    };
  }

  // Last resort: national
  return {
    type: "national",
    code: "US",
    name: "United States",
  };
}

/**
 * Get the fallback region when the primary region has insufficient peers.
 * metro -> state -> national
 *
 * @param currentRegion - The current region
 * @param state - The state name or abbreviation (needed for metro -> state fallback)
 * @returns The next less-specific region, or null if already national
 */
export function getFallbackRegion(
  currentRegion: Region,
  state: string
): Region | null {
  if (currentRegion.type === "national") {
    return null; // No further fallback
  }

  if (currentRegion.type === "metro") {
    // Fall back to state
    const normalizedState = state.toLowerCase().trim();
    const stateData = STATE_CODES[normalizedState];
    if (stateData) {
      return {
        type: "state",
        code: stateData.code,
        name: stateData.name,
      };
    }
    // If state not found, go to national
    return {
      type: "national",
      code: "US",
      name: "United States",
    };
  }

  // state -> national
  return {
    type: "national",
    code: "US",
    name: "United States",
  };
}

/**
 * Format a region for display in the UI.
 * Examples:
 *   - "Chicago Metro Area" (metro)
 *   - "Illinois" (state)
 *   - "Nationwide" (national)
 */
export function formatRegionDisplay(region: Region): string {
  switch (region.type) {
    case "metro":
      return `${region.name} Metro Area`;
    case "state":
      return region.name;
    case "national":
      return "Nationwide";
  }
}

/**
 * Get the region hierarchy for a business.
 * Returns all regions from most to least specific.
 * Useful for fallback queries.
 */
export function getRegionHierarchy(city: string, state: string): Region[] {
  const regions: Region[] = [];
  const normalizedCity = city.toLowerCase().trim();
  const normalizedState = state.toLowerCase().trim();

  // Try metro first
  const msa = MSA_LOOKUP[normalizedCity];
  if (msa) {
    regions.push({
      type: "metro",
      code: msa.code,
      name: msa.name,
    });
  }

  // Add state
  const stateData = STATE_CODES[normalizedState];
  if (stateData) {
    regions.push({
      type: "state",
      code: stateData.code,
      name: stateData.name,
    });
  }

  // Always include national
  regions.push({
    type: "national",
    code: "US",
    name: "United States",
  });

  return regions;
}

/**
 * Check if we have MSA data for a given city.
 * Used to determine if metro-level benchmarking is possible.
 */
export function hasMsaData(city: string): boolean {
  return city.toLowerCase().trim() in MSA_LOOKUP;
}

/**
 * Get all supported MSA codes.
 * Used for batch operations and analytics.
 */
export function getAllMsaCodes(): string[] {
  const codes = new Set<string>();
  for (const msa of Object.values(MSA_LOOKUP)) {
    codes.add(msa.code);
  }
  return Array.from(codes);
}
