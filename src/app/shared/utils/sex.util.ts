export const translateSexLabel = (sex: string) => {
  switch (sex) {
    case 'bi':
      return 'Bisexual';
    case 'ho':
      return 'Homosexual';
    case 'as':
      return 'Asexual';
    case 'none':
      return 'No sexuality';
    case undefined:
      return 'Heterosexual';
    default:
      return sex;
  }
}