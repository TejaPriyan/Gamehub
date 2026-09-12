export const Head = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://tejapriyanhub.vercel.app/#website",
        "url": "https://tejapriyanhub.vercel.app/",
        "name": "Teja Priyan GameHub",
        "description": "Cyberpunk gaming arena with instant browser HTML5 games.",
        "inLanguage": "en-US"
      },
      {
        "@type": "WebApplication",
        "name": "Teja Priyan GameHub",
        "url": "https://tejapriyanhub.vercel.app/",
        "applicationCategory": "GameApplication",
        "operatingSystem": "All modern web browsers"
      }
    ]
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Teja Priyan GameHub - Cyberpunk Browser Gaming Arena</title>
      <meta
        name="description"
        content="Teja Priyan GameHub is a neon cyberpunk arcade hub. Create your operative identity and battle through 8 custom HTML5 mini-games with zero input lag and full screen support."
      />
      <meta name="keywords" content="Gamehub, Cyberpunk games, browser arcade, mini games, online gaming, html5 arcade, neon games" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href="https://tejapriyanhub.vercel.app/" />

      {/* Google & Search Engine Verification */}
      <meta name="google-site-verification" content="google87bb3bc53ec346d2.html" />
      <meta name="google-site-verification" content="87bb3bc53ec346d2" />
      <meta name="msvalidate.01" content="55A817D313620EDBE729ED7B7D416DA7" />

      {/* Open Graph / Facebook */}
      <meta name="theme-color" content="#1A1A2E" />
      <meta property="og:title" content="Teja Priyan GameHub - Cyberpunk Gaming Arena" />
      <meta
        property="og:description"
        content="A cyberpunk gaming arena - forge your player card and dominate 8 custom HTML5 arcade games."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://tejapriyanhub.vercel.app/" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Teja Priyan GameHub - Cyberpunk Gaming Arena" />
      <meta name="twitter:description" content="A cyberpunk gaming arena - forge your player card and dominate 8 custom HTML5 arcade games." />

      {/* Favicons */}
      <link rel="icon" href={`${import.meta.env.BASE_URL}favicon.ico`} sizes="any" />
      <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
      <link rel="apple-touch-icon" href={`${import.meta.env.BASE_URL}apple-touch-icon.png`} />

      {/* Semantic JSON-LD (AEO) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Fonts */}
      <link rel="preconnect" href="https://static.parastorage.com" />
    </>
  );
};
