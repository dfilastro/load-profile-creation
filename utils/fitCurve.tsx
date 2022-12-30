import { sum } from './sum';
import { avg } from './avg';
import { max } from './max';
import { min } from './min';

// profile = load profile unitary (0 to 1)
// peak = target peak
// demand = target demand

export function fitCurve(demand: Array<number>, peak: Array<number>, profile: Array<number>) {
  let yearlyDemand = 0;

  // if the user passes just the yearly demand and peak
  if (demand.length === 1) yearlyDemand = demand[0] as number;

  // if the user passes a monthly demand and peak
  if (demand.length > 1 && demand.length <= 12)
    yearlyDemand = ((sum(demand) / demand.length) * 12) as number;

  if (yearlyDemand > profile.length * max(peak)) return 'Impossible';

  const secondAvg = yearlyDemand / profile.length;

  const firstAdjust = profile.map((item) => {
    return max(peak) * item;
  });

  const firstAvg = avg(firstAdjust);

  const secondAdjust = firstAdjust.map((item) => {
    const xLine =
      ((item - firstAvg) * (max(peak) - secondAvg)) / (max(peak) - firstAvg) + secondAvg;

    if (xLine >= 0) return xLine;

    return min(firstAdjust);
  });

  if (sum(secondAdjust) !== yearlyDemand) {
    const multp = (yearlyDemand - max(peak)) / (sum(secondAdjust) - max(peak));

    const thirdAdjust = secondAdjust.map((item) => {
      if (item === max(peak)) return max(peak);

      return item * multp;
    });

    return thirdAdjust;
  }

  return secondAdjust;
}
