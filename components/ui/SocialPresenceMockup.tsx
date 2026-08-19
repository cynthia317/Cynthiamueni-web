import { Eye, Megaphone, MessageCircle, ThumbsUp, TrendingUp } from "lucide-react";

const STAT_TILES = [
  { label: "Posts Published", icon: Megaphone },
  { label: "Profile Views", icon: Eye },
  { label: "Engagement", icon: TrendingUp },
];

const POSTS = [
  { label: "Safety Culture Series (LinkedIn)", stat: "48", icon: ThumbsUp },
  { label: "Google Business Profile Update", stat: "12", icon: MessageCircle },
  { label: "Monthly Content Calendar", stat: "Live", icon: TrendingUp },
];

export default function SocialPresenceMockup() {
  return (
    <div aria-hidden className="flex h-full w-full flex-col bg-white dark:bg-slate-950">
      <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        <span className="ml-2 text-xs font-medium text-slate-400 dark:text-slate-500">Safetec Solutions</span>
        <span className="ml-auto rounded-full bg-slate-200 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          Illustrative
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-4 p-5 sm:p-7">
        <div className="grid grid-cols-3 gap-3">
          {STAT_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.label}
                className="flex flex-col items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-2 py-4 text-center dark:border-slate-800 dark:bg-slate-900"
              >
                <Icon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium leading-tight text-slate-600 dark:text-slate-400">
                  {tile.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-slate-100 p-4 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            Channel Mix
          </span>
          <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <span className="h-full w-1/2 bg-amber-500/70" />
            <span className="h-full w-1/4 bg-amber-300/70" />
            <span className="h-full w-1/4 bg-slate-300 dark:bg-slate-700" />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 rounded-lg border border-slate-100 p-4 dark:border-slate-800">
          {POSTS.map((post) => {
            const Icon = post.icon;
            return (
              <div key={post.label} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm text-slate-600 dark:text-slate-400">{post.label}</span>
                <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
                  <Icon className="h-3 w-3" />
                  {post.stat}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
