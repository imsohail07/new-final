export default function ArticleCard({ article, onSave }) {
  const {
    title,
    description,
    url,
    urlToImage,
    source,
    publishedAt,
  } = article;

  return (
    <article className="bg-black/40 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-md shadow-black/40 hover:border-purple-500/70 transition-all">
      {urlToImage && (
        <div className="mb-3 overflow-hidden rounded-xl">
          <img
            src={urlToImage}
            alt={title}
            className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-600/40">
            {source?.name || "Unknown source"}
          </span>
          {publishedAt && (
            <span>
              {new Date(publishedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          )}
        </div>

        <h2 className="text-sm font-semibold mt-1 line-clamp-2">{title}</h2>

        {description && (
          <p className="text-xs text-slate-300/80 line-clamp-3">
            {description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 text-xs">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="underline text-sky-400 hover:text-sky-300"
        >
          Read full article
        </a>

        <button
  onClick={async () => {
    try {
      // prefer parent-provided onSave handler (Dashboard passes this), fallback to no-op
      if (onSave) await onSave(article);
      // optionally set local state so button turns yellow
      // setSaved(true);
    } catch (e) {
      console.error(e);
      alert("Failed to save article");
    }
  }}
  className="px-4 py-2 rounded-full bg-yellow-500 text-black font-medium hover:bg-yellow-400"
>
  Save
</button>

      </div>
    </article>
  );
}
