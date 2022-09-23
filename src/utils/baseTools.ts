export const getUUID = (randomLength?: 8) => {
    return Number(Math.random().toString().substring(2, randomLength) + Date.now()).toString(36);
};
