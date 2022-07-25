function findStatistics(res, type) {
    return res.find((item) => item.statistics_name === type);
}

export { findStatistics };
