/**
 *
 */
export function calculateAge(dateOfBirth: Date | string): number | null {
  if (!dateOfBirth) {
    return null;
  }

  const dob = new Date(dateOfBirth);

  // Check if the date is valid
  if (isNaN(dob.getTime())) {
    console.error('Invalid date provided to calculateAge:', dateOfBirth);
    return null;
  }

  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}
