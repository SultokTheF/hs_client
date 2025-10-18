export const useSuggestions = () => {
  const suggest = (): string[] => {
    return [
      "Camera pulls back to a wide shot",
      "Change of angle — first-person view",
      "Suddenly, a sandstorm begins",
    ];
  };
  return { suggest };
};
