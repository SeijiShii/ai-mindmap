import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export interface MapListItem {
  id: string;
  title: string;
}

/** Map list (home): the owner's maps + a create action. Data injected by route. */
export function MapList({ maps, onCreate }: { maps: MapListItem[]; onCreate: () => void }) {
  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-medium">マップ</h1>
        <Button onClick={onCreate}>あたらしいマップ</Button>
      </div>
      {maps.length === 0 ? (
        <p className="text-text-muted">
          まだマップがありません。「あたらしいマップ」から始めましょう。
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {maps.map((m) => (
            <li key={m.id}>
              <Link
                to={`/map/${m.id}`}
                className="block rounded-md border border-border bg-surface p-3 shadow-soft hover:bg-surface-muted"
              >
                {m.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
