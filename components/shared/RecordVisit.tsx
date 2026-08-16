'use client';

import { useEffect } from 'react';
import { pushRecent } from '@/lib/recent';

/** Notes that a tool was opened, so the palette can offer it next time. */
export default function RecordVisit({ id }: { id: string }) {
  useEffect(() => {
    pushRecent(id);
  }, [id]);

  return null;
}
