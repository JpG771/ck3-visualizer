export const skillToLabel = (skill: number) => {
  if (skill >= 70) return 'Excellent';
  if (skill == 69) return 'Nice';
  if (skill > 16) return 'Excellent'
  if (skill > 12) return 'Good';
  if (skill > 8) return 'Average';
  if (skill > 4) return 'Poor';
  return 'Terrible';
}

export const healthToLabel = (health: number) => {
  if (health >= 7) return 'Excellent';
  if (health >= 5) return 'Good';
  if (health >= 3) return 'Fine';
  if (health >= 1) return 'Poor';
  if (health >= 0) return 'Near Death';
  return 'Dying';
}

export const stressToLevel = (stress: number) => {
  if (stress >= 300) return 'Level 3';
  if (stress >= 200) return 'Level 2';
  if (stress >= 100) return 'Level 1';
  return '';
}

export const weightToLabel = (weight: number) => {
  if (weight > 50) return 'Obese';
  if (weight < -50) return 'Malnourished';
  return 'Normal';
}
