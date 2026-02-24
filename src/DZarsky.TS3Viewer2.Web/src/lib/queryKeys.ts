export const serverKeys = {
  all: () => ["server"] as const,
  info: () => [...serverKeys.all(), "info"] as const,
  clients: (includeQuery?: boolean) => [...serverKeys.all(), "clients", { includeQuery }] as const,
  channels: () => [...serverKeys.all(), "channels"] as const,
  groups: () => [...serverKeys.all(), "groups"] as const,
};

export const userKeys = {
  all: () => ["users"] as const,
  list: () => [...userKeys.all(), "list"] as const,
};

export const fileKeys = {
  all: () => ["files"] as const,
  list: () => [...fileKeys.all(), "list"] as const,
};

export const audioBotKeys = {
  all: () => ["audiobot"] as const,
  song: () => [...audioBotKeys.all(), "song"] as const,
  volume: () => [...audioBotKeys.all(), "volume"] as const,
};
