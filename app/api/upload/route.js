import { NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth';
import { saveImage } from '@/lib/storage';

/** Admin-only image upload. Expects multipart form data with a `file` field. */
export async function POST(request) {
  const session = await getSession();
  if (!isAdmin(session)) {
    return NextResponse.json({ error: 'Admins only.' }, { status: 403 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart form data.' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  try {
    const { url } = await saveImage(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Upload failed.' }, { status: 400 });
  }
}
