import Link from 'next/link';
import React from 'react'

function JumperSection({ list }) {
    return (
        <div className="p-6 flex gap-4 mt-[64px] overflow-x-auto whitespace-nowrap scrollbar-hide">
  {list.map((item) => (
    <Link
      key={item.href}
      href={`#${item.href}`}
      className="px-3 py-2 rounded-full bg-white/15 text-sm"
    >
      {item.label}
    </Link>
  ))}
</div>

    )
}

export default JumperSection;