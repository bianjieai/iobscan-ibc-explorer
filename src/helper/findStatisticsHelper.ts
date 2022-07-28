export function findStatistics(res: any, type: string) {
    return res.find((item: any) => item.statistics_name === type);
}
