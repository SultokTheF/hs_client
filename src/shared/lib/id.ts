export const uid = () => "p_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
