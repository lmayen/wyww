
export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
        return `${remainingMinutes}MIN`;
    }

    if (remainingMinutes === 0) {
        return `${hours}H`;
    }

    return `${hours}H ${remainingMinutes}MIN`;
}