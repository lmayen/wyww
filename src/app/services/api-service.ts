import {inject, Service} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environment";
import {WywwMovieData} from "../core/models/data";
import {Observable} from "rxjs";
import {FilterItem} from "../core/models/filters";
import {SortDirection, SortParameters} from "../core/models/sorting";
import {PaginationParameters} from "../core/models/pagination";
import {RecommendationData, RecommendedData, WatchedData, WatchlistData} from "../core/models/custom";

@Service()
export class ApiService {
    private http: HttpClient = inject(HttpClient);
    private uri: string = `${environment.apiUrl}/wyww`;

    findOneMovies(filters: FilterItem[], sorting?: SortParameters): Observable<WywwMovieData> {
        return this.http.post<WywwMovieData>(`${this.uri}/movie/findOne`, {filters, sorting});
    }

    findManyMovies(filters: FilterItem[], sorting: SortParameters, pagination: PaginationParameters): Observable<WywwMovieData[]> {
        return this.http.post<WywwMovieData[]>(`${this.uri}/movie/findMany`,
            {filters, sorting, pagination}
        );
    }

    newMovieRecommendation(): Observable<RecommendationData> {
        return this.http.get<RecommendationData>(`${this.uri}/movie/newRecommendation`);
    }

    swapMovieRecommendation(id: string): Observable<RecommendationData> {
        return this.http.get<RecommendationData>(`${this.uri}/movie/swapRecommendation`, {params: {id}});
    }

    watchlist(id: string): Observable<WatchlistData> {
        return this.http.get<WatchlistData>(`${this.uri}/movie/watchlist`, {params: {id}});
    }

    toggleWatched(id: string): Observable<WatchedData> {
        return this.http.patch<WatchedData>(`${this.uri}/movie/toggleWatched`, {id});
    }

    toggleRecommended(id: string): Observable<RecommendedData> {
        return this.http.patch<RecommendedData>(`${this.uri}/movie/toggleWatched`, {id});
    }

}
