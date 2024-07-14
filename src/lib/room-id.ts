// Function to generate a random string in the format "abc-def-ghi"
export const createRoomId = (roomIds: string[] = []): string => {
  let id = Array.from(
    { length: 10 },
    () => "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]
  )
    .map((c, i) => (i === 3 || i === 7 ? "-" + c : c))
    .join("");

  if (roomIds.includes(id)) return createRoomId(roomIds);
  else return id;
};

// Function to check if a string follows the Google Meet link format
export function isValidRoomId(link: string): boolean {
  const roomIdPattern = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/;

  if (link.match(roomIdPattern)) return true;

  const pattern = new RegExp(
    `(https?:\\/\\/)?(?:www\\.|(?!www))${(
      process.env.NEXT_PUBLIC_URL ?? ""
    ).replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )}\\/\\b[a-z]{3}-[a-z]{4}-[a-z]{3}\\b`
  );
  if (link.match(pattern)) return true;

  return false;
}

export function isLinkOrCode(text: string): "link" | "code" | false {
  const roomIdPattern = /^[a-z]{3}-[a-z]{4}-[a-z]{3}$/;

  if (text.match(roomIdPattern)) return "code";

  const pattern = new RegExp(
    `(https?:\\/\\/)?(?:www\\.|(?!www))${(
      process.env.NEXT_PUBLIC_URL ?? ""
    ).replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )}\\/\\b[a-z]{3}-[a-z]{4}-[a-z]{3}\\b`
  );
  if (text.match(pattern)) return "link";

  return false;
}
