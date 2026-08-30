export const Head = () => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Teja Priyan World — Play, Forge Your Legend</title>
      <meta
        name="description"
        content="Teja Priyan World is a neon cyberpunk gaming hub. Create your player identity and battle through a growing arena of mini-games."
      />
      <meta name="theme-color" content="#1A1A2E" />
      <meta property="og:title" content="Teja Priyan World" />
      <meta
        property="og:description"
        content="A cyberpunk gaming arena — forge your player card and dominate the mini-games."
      />
      <meta property="og:type" content="website" />
      <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
      {/* Fonts */}
      <link rel="preconnect" href="https://static.parastorage.com" />
    </>
  );
};
