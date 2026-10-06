import { RightSidebar } from './RightSidebar';

/** Main column plus the right "highlights" sidebar for public pages. */
export function PublicColumns({ children }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="min-w-0 space-y-4">{children}</div>
      <RightSidebar />
    </div>
  );
}
