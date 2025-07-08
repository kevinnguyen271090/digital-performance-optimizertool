import { AttributionJourney } from './mockAttributionJourneys';

export type AttributionModel = 'Last Click' | 'First Click' | 'Linear' | 'Time Decay' | 'Position-based (U-shaped)';

export function calculateAttribution(journeys: AttributionJourney[], model: AttributionModel): Record<string, number> {
  const result: Record<string, number> = {};
  journeys.forEach(journey => {
    const steps = journey.steps;
    if (steps.length === 0) return;
    switch (model) {
      case 'Last Click': {
        const channel = steps[steps.length - 1];
        result[channel] = (result[channel] || 0) + 1;
        break;
      }
      case 'First Click': {
        const channel = steps[0];
        result[channel] = (result[channel] || 0) + 1;
        break;
      }
      case 'Linear': {
        const value = 1 / steps.length;
        steps.forEach(channel => {
          result[channel] = (result[channel] || 0) + value;
        });
        break;
      }
      case 'Time Decay': {
        // Gần chuyển đổi hơn thì điểm cao hơn, decay = 0.5 mỗi bước lùi
        let total = 0;
        const weights = steps.map((_, i) => Math.pow(0.5, steps.length - 1 - i));
        total = weights.reduce((a, b) => a + b, 0);
        steps.forEach((channel, i) => {
          result[channel] = (result[channel] || 0) + weights[i] / total;
        });
        break;
      }
      case 'Position-based (U-shaped)': {
        // Đầu & cuối mỗi kênh 40%, giữa chia đều 20%
        if (steps.length === 1) {
          result[steps[0]] = (result[steps[0]] || 0) + 1;
        } else if (steps.length === 2) {
          result[steps[0]] = (result[steps[0]] || 0) + 0.5;
          result[steps[1]] = (result[steps[1]] || 0) + 0.5;
        } else {
          result[steps[0]] = (result[steps[0]] || 0) + 0.4;
          result[steps[steps.length - 1]] = (result[steps[steps.length - 1]] || 0) + 0.4;
          const midValue = 0.2 / (steps.length - 2);
          for (let i = 1; i < steps.length - 1; i++) {
            result[steps[i]] = (result[steps[i]] || 0) + midValue;
          }
        }
        break;
      }
      default:
        break;
    }
  });
  return result;
} 