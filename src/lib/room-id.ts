// Function to generate a random string in the format "abc-def-ghi"
export function generateRoomId(): string {
  return Array.from(
    { length: 10 },
    () => "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
  )
    .map((c, i) => (i === 3 || i === 7 ? "-" + c : c))
    .join("");
}

// Function to check if a string follows the Google Meet link format
export function isValidRoomId(link: string): boolean {
  const pattern = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/;
  return pattern.test(link);
}
