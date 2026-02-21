import type { Person } from "@/types/wedding";

interface PeopleGridProps {
  people: Person[];
}

export function PeopleGrid({ people }: PeopleGridProps) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
      <h2 className="text-sm font-bold text-red-800 mb-2">👥 Ai Có Mặt</h2>
      <div className="grid grid-cols-3 gap-2 max-sm:grid-cols-2">
        {people.map((person, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-amber-50 rounded-lg p-2"
          >
            <div className="text-2xl mb-1">{person.avatar}</div>
            <div className="text-xs font-semibold text-gray-800 leading-tight">{person.name}</div>
            {person.role && (
              <div className="text-[0.6rem] text-gray-500 mt-0.5">{person.role}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
