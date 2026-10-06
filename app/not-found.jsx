import { Panel } from '@/components/ui/Panel';
import { ButtonLink } from '@/components/ui/Button';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <Panel title="404: Cartridge not found" id="not-found">
      <p className="font-terminal text-2xl leading-tight text-grape-700">
        You blew into it, reseated it, and it still won&rsquo;t load.
      </p>
      <p className="mt-2">That page doesn&rsquo;t exist, or the review hasn&rsquo;t been published yet.</p>
      <div className="mt-4">
        <ButtonLink href="/">Back to the title screen</ButtonLink>
      </div>
    </Panel>
  );
}
