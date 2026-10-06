import { ButtonLink } from '@/components/ui/Button';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="surface relative mx-auto max-w-2xl overflow-hidden px-6 py-16 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(123_63_228/0.35),transparent_70%)]" />
      <p className="eyebrow relative">Error 404</p>
      <h1 className="relative mt-4 font-pixel text-3xl text-white drop-shadow-[4px_4px_0_theme(colors.grape.700)] sm:text-5xl">
        GAME OVER
      </h1>
      <p className="relative mx-auto mt-6 max-w-md text-grape-100">
        You blew into the cartridge, reseated it, and it still won&rsquo;t load. That page doesn&rsquo;t exist, or the
        review hasn&rsquo;t been published yet.
      </p>
      <p className="relative mt-8 font-terminal text-2xl uppercase tracking-widest text-teal-300">Continue?</p>
      <div className="relative mt-4 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Yes: title screen</ButtonLink>
        <ButtonLink href="/reviews" variant="plain">
          Browse reviews
        </ButtonLink>
      </div>
    </div>
  );
}
