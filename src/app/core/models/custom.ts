import {WywwGenreData, WywwMovieData} from "./data";

export interface RecommendationData {
    main: WywwMovieData,
    genres: {[key: string]: WywwMovieData[]},
}

export interface WatchedData {
    watched: boolean
}

export interface RecommendedData {
    recommended: boolean
}

export interface WatchlistData extends WatchedData, RecommendedData {}