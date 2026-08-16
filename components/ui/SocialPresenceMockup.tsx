import { Eye, Megaphone, MessageCircle, ThumbsUp, TrendingUp } from "lucide-react";

const STAT_TILES = [
  { label: "Posts Published", icon: Megaphone },
  { label: "Profile Views", icon: Eye },
  { label: "Engagement", icon: TrendingUp },
];

const POSTS = [
  { label: "Safety Culture Series — LinkedIn", stat: "48", icon: ThumbsUp },
  { label: "Google Business Profile Update", stat: "12", icon: MessageCircle },
  { label: "Monthly Content Calendar", stat: "Live", icon: TrendingUp },
];

export default function SocialPresenceMockup() {
  return (
    <div aria-hidden className="flex h-full w-full items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-950">
        <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="ml-2 text-[0.65rem] font-medium text-slate-400 dark:text-slate-500">
            Safetec Solutions
          </span>
          <span className="ml-auto rounded-full bg-slate-200 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Illustrative
          </span>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="grid grid-cols-3 gap-2">
            {STAT_TILES.map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.label}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2 py-3 text-center dark:border-slate-800 dark:bg-slate-900"
                >
                  <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-[0.6rem] font-medium leading-tight text-slate-600 dark:text-slate-400">
                    {tile.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-slate-100 p-3 dark:border-slate-800">
            {POSTS.map((post) => {
              const Icon = post.icon;
              return (
                <div key={post.label} className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs text-slate-600 dark:text-slate-400">{post.label}</span>
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[0.6rem] font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-400">
                    <Icon className="h-2.5 w-2.5" />
                    {post.stat}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
