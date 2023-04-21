import { avg } from './avg';
import { max } from './max';
import { min } from './min';
import { sum } from './sum';

export function synthesize_profile(profile: number[], consumption: number[], demand: number[]) {
  // Creates a new array with the same length as the profile
  const yearlyProfile = profile.slice(0, 8760);
  const monthlyProfile = [];
  let monthlyConsumption = 0;

  // Splits the yearly profile into 12 monthly profiles
  for (let i = 0; i < 12; i++) {
    const startIndex = i * 730;
    const endIndex = startIndex + 730;
    monthlyProfile.push(yearlyProfile.slice(startIndex, endIndex));
  }

  const monthlyAdjustedProfile = [] as number[];

  // Loops through each month and adjusts the profile according to the monthly demand
  monthlyProfile.map((month, i) => {
    monthlyConsumption = consumption[i] as number;

    // if (monthlyConsumption > profile.length * max(demand)) return 'Impossible';

    const secondAvg = monthlyConsumption / month.length;

    const firstAdjust = month.map((item) => {
      return demand[i] * item;
    });

    const firstAvg = avg(firstAdjust);

    // The monthly profile is adjusted to fit the monthly consumption
    const secondAdjust = firstAdjust.map((item) => {
      const xLine =
        ((item - firstAvg) * (demand[i] - secondAvg)) / (demand[i] - firstAvg) + secondAvg;

      if (xLine >= 0) return xLine;

      return min(firstAdjust);
    });

    if (sum(secondAdjust) !== monthlyConsumption) {
      const multp = (monthlyConsumption - demand[i]) / (sum(secondAdjust) - demand[i]);

      const thirdAdjust = secondAdjust.map((item: any) => {
        if (item === demand[i]) return demand[i];

        return item * multp;
      });

      return monthlyAdjustedProfile.push(...thirdAdjust);
    }

    return monthlyAdjustedProfile.push(...secondAdjust);
  });

  return monthlyAdjustedProfile;
}
