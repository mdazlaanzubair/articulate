type Props = {};

export const Footer = (props: Props) => {
  return (
    <footer className="w-full h-auto flex items-center justify-between gap-3 border-t px-5 py-3">
      <p className="w-full text-center text-xs">
        Developed by{" "}
        <a
          className="text-primary font-semibold underline"
          href="https://mdazlaanzubair.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Md Azlaan Zubair
        </a>
      </p>
    </footer>
  );
};
