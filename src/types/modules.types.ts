interface Module {
  id: string;
  position?: number;
  title?: string;
  description?: string;
  colour?: string;
  lessons?: { id: string; title: string }[];
  progress?: number;
}
