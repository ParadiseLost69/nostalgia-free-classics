/*
 * Tiny 8×8 pixel-art icons drawn from string bitmaps, so we don't ship image
 * files. "#" = filled pixel. Decorative unless a `label` is passed.
 */
const ICONS = {
  star: ['...##...', '...##...', '########', '.######.', '..####..', '.##..##.', '##....##', '........'],
  heart: ['........', '.##.##..', '#######.', '#######.', '.#####..', '..###...', '...#....', '........'],
  joystick: ['...##...', '...##...', '....#...', '....#...', '..####..', '.######.', '########', '########'],
  scroll: ['.######.', '#......#', '.#.##.#.', '.#....#.', '.#.##.#.', '.#....#.', '#......#', '.######.'],
  home: ['...##...', '..####..', '.######.', '########', '.#....#.', '.#.##.#.', '.#.##.#.', '.######.'],
  rss: ['#.......', '.##.....', '...#....', '##..#...', '..#..#..', '#..#.#..', '##.#..#.', '##.#..#.'],
  comment: ['########', '#......#', '#.####.#', '#......#', '#.###..#', '########', '.##.....', '#.......'],
  key: ['.###....', '#...#...', '#...####', '#...#.#.', '.###..#.', '........', '........', '........'],
  dice: ['########', '#......#', '#.#..#.#', '#......#', '#..##..#', '#......#', '#.#..#.#', '########'],
};

/**
 * @param {{ name: keyof ICONS, size?: number, className?: string, label?: string }} props
 */
export function PixelIcon({ name, size = 16, className = '', label }) {
  const rows = ICONS[name] ?? ICONS.star;
  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      className={`inline-block shrink-0 fill-current ${className}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {rows.flatMap((row, y) =>
        [...row].map((c, x) => (c === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" /> : null)),
      )}
    </svg>
  );
}
