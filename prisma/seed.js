// Seeds the admin user (ADMIN_EMAIL) and three sample reviews. Safe to re-run.
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ---- Tiny Tiptap JSON builders ----
const text = (t, marks) => ({ type: 'text', text: t, ...(marks ? { marks } : {}) });
const bold = (t) => text(t, [{ type: 'bold' }]);
const italic = (t) => text(t, [{ type: 'italic' }]);
const p = (...children) => ({ type: 'paragraph', content: children.map((c) => (typeof c === 'string' ? text(c) : c)) });
const h2 = (t) => ({ type: 'heading', attrs: { level: 2 }, content: [text(t)] });
const h3 = (t) => ({ type: 'heading', attrs: { level: 3 }, content: [text(t)] });
const ul = (...items) => ({ type: 'bulletList', content: items.map((i) => ({ type: 'listItem', content: [p(i)] })) });
const quote = (t) => ({ type: 'blockquote', content: [p(t)] });
const hr = () => ({ type: 'horizontalRule' });
const doc = (...content) => ({ type: 'doc', content });

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const utc = (iso) => new Date(`${iso}T00:00:00.000Z`);

const REVIEWS = [
  {
    slug: 'super-mario-64-still-the-blueprint',
    title: 'Super Mario 64: Still the Blueprint, Still Fighting the Camera',
    gameTitle: 'Super Mario 64',
    platform: 'Nintendo 64',
    gameReleaseDate: utc('1996-06-23'),
    score: 8.5,
    datePosted: daysAgo(3),
    excerpt:
      'The movement is still a joy nearly thirty years on. The camera, however, has aged like milk left in a hot cartridge slot.',
    content: doc(
      p(
        'Strip away the memory of unwrapping a grey console on Christmas morning and ',
        italic('Super Mario 64'),
        ' is still a remarkably good game. That is rarer than you would think.',
      ),
      h2('What holds up'),
      p(
        'Mario himself. The triple jump, the long jump, the wall kick: the moveset has a weight and precision that plenty of modern platformers still chase. Peach’s Castle works as a hub because it is ',
        bold('dense'),
        ', not big.',
      ),
      ul(
        'Analog movement that feels deliberate, not floaty',
        'Levels designed as playgrounds with several stars, not corridors',
        'A soundtrack that is still stuck in your head, sorry',
      ),
      h2('What doesn’t'),
      p(
        'The Lakitu camera. You will spend a noticeable share of every session nudging the C-buttons and watching Mario run off a ledge you couldn’t see. Some stars (looking at you, Tick Tock Clock) are more about luck than skill.',
      ),
      quote('A masterpiece of movement trapped behind a camera that was learning on the job.'),
      hr(),
      h3('Verdict'),
      p('Play it. Expect to swear at the camera. Still one of the best 3D platformers ever made.'),
    ),
  },
  {
    slug: 'final-fantasy-vii-the-story-lands',
    title: 'Final Fantasy VII: The Story Lands, the Translation Stumbles',
    gameTitle: 'Final Fantasy VII',
    platform: 'PlayStation',
    gameReleaseDate: utc('1997-01-31'),
    score: 7.0,
    datePosted: daysAgo(40),
    excerpt:
      'Midgar is still a stunning opening act. The rest is a long, lumpy, frequently brilliant JRPG with a script that needed one more pass.',
    content: doc(
      p(
        'Judged as a new release, ',
        italic('Final Fantasy VII'),
        ' is a game of huge highs and long, flat stretches. The Materia system is flexible and fun to tinker with; the random encounter rate is not.',
      ),
      h2('The good'),
      ul(
        'Midgar: still one of the best opening chapters in the genre',
        'Materia lets you build parties your way',
        'Big, weird, earnest storytelling that takes real risks',
      ),
      h2('The less good'),
      p(
        'The original localisation is famously rough, and the pre-rendered backgrounds make it hard to tell what you can walk on. Expect to run into a lot of walls looking for the exit.',
      ),
      p(bold('Verdict:'), ' worth playing, but bring patience and a guide for the optional stuff.'),
    ),
  },
  {
    slug: 'goldeneye-007-a-great-party-a-rough-reunion',
    title: 'GoldenEye 007: A Great Party, a Rough Reunion',
    gameTitle: 'GoldenEye 007',
    platform: 'Nintendo 64',
    gameReleaseDate: utc('1997-08-25'),
    score: 5.5,
    datePosted: daysAgo(90),
    excerpt:
      'Its mission design was ahead of its time. Its controls, frame rate and fog are very much of their time.',
    content: doc(
      p(
        'Nobody forgets four-player split screen in the Facility. Fewer people remember aiming with one analog stick at around 15 frames per second. Coming back to ',
        italic('GoldenEye'),
        ' today means remembering both.',
      ),
      h2('Still impressive'),
      p(
        'The objective-based missions, where harder difficulties add tasks rather than just bullet sponges, are a genuinely great idea that many modern shooters still ignore.',
      ),
      h2('Hard to go back to'),
      ul(
        'Single-stick controls that fight you constantly',
        'Frame rate that drops whenever things get exciting',
        'Fog. So much fog.',
      ),
      quote('Historically essential, practically exhausting.'),
      p(bold('Verdict:'), ' play it for history, or play a modern shooter that learned from it.'),
    ),
  },
];

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) throw new Error('Set ADMIN_EMAIL in .env before seeding.');

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: { email, name: 'Site Admin', role: 'ADMIN' },
  });
  console.log(`Admin user: ${admin.email}`);

  for (const review of REVIEWS) {
    const { slug, ...data } = review;
    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: { ...data, slug, status: 'PUBLISHED', authorId: admin.id },
    });
    console.log(`Review: ${review.title}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
