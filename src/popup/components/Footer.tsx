const Footer = () => {
  return (
    <footer className="w-full flex items-center justify-between gap-3 border-t border-black/10 bg-base-300 p-3">
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

export default Footer;
