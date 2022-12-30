import { sum } from '../utils/sum';
import { avg } from '../utils/avg';

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

  if (yearlyDemand > profile.length * peak.max()) return 'Impossible';

  const secondAvg = yearlyDemand / profile.length;

  const firstAdjust = profile.map((item) => {
    return peak.max() * item;
  });

  const firstAvg = avg(firstAdjust);

  const secondAdjust = firstAdjust.map((item) => {
    const xLine =
      ((item - firstAvg) * (peak.max() - secondAvg)) / (peak.max() - firstAvg) + secondAvg;

    if (xLine >= 0) return xLine;

    return firstAdjust.min();
  });

  if (sum(secondAdjust) !== yearlyDemand) {
    const multp = (yearlyDemand - peak.max()) / (sum(secondAdjust) - peak.max());

    const thirdAdjust = secondAdjust.map((item) => {
      if (item === peak.max()) return peak.max();

      return item * multp;
    });

    return thirdAdjust;
  }

  return secondAdjust;
}

declare global {
  interface Array<T> {
    max(): number;
    min(): number;
  }
}
