type Props = {
  id: number;
  title: string;
  url: string;
  video: {
    url: string;
    title: string;
  };
};

const GuideContent = (props: Props) => {
  return (
    <div key={props.id} className="flex flex-col gap-3">
      <h1 className="text-lg font-bold">{props.title}</h1>
      <div className="aspect-video w-full rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700">
        <iframe
          className="w-full h-full"
          src={props.video.url}
          title={props.video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
      <a
        role="button"
        target="_blank"
        rel="noreferrer"
        href={props.url}
        className="btn btn-neutral btn-sm w-full"
      >
        Checkout Official Docs
      </a>
    </div>
  );
};

export default GuideContent;
