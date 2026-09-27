import {environment} from "../../environment";


export function evalImageSource(id: string): string {
    return `${environment.apiUrl}/images/${id}`;
}