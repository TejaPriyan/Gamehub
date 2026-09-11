export const Head = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://tejapriyan.github.io/Gamehub/#website",
        "url": "https://tejapriyan.github.io/Gamehub/",
        "name": "Teja Priyan World",
        "description": "Cyberpunk gaming arena by Teja Priyan (Tejapriyan).",
        "publisher": { "@id": "https://portfoliotejapriyan.vercel.app/#person" },
        "inLanguage": "en-US"
      },
      {
        "@type": "Person",
        "@id": "https://portfoliotejapriyan.vercel.app/#person",
        "name": "Teja Priyan",
        "alternateName": ["Myself Teja Priyan", "Tejapriyan", "Teja Priyan Sivaraj"],
        "url": "https://portfoliotejapriyan.vercel.app/",
        "jobTitle": "AI Engineer & Full Stack Developer",
        "sameAs": [
          "https://github.com/TejaPriyan",
          "https://huggingface.co/teja161615",
          "https://portfoliotejapriyan.vercel.app/"
        ]
      },
      {
        "@type": "WebApplication",
        "name": "Teja Priyan World",
        "url": "https://tejapriyan.github.io/Gamehub/",
        "applicationCategory": "GameApplication",
        "operatingSystem": "All modern web browsers",
        "author": { "@id": "https://portfoliotejapriyan.vercel.app/#person" }
      }
    ]
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Teja Priyan World — Play, Forge Your Legend | Cyberpunk Gaming Arena</title>
      <meta
        name="description"
        content="Teja Priyan World is a neon cyberpunk gaming hub by Teja Priyan (Tejapriyan). Create your player identity and battle through a growing arena of mini-games."
      />
      <meta name="keywords" content="Teja Priyan World, Gamehub, Cyberpunk games, browser arcade, Teja Priyan, Tejapriyan, mini games, online gaming, html5 arcade" />
      <meta name="author" content="Teja Priyan (Teja Priyan Sivaraj)" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href="https://tejapriyan.github.io/Gamehub/" />

      {/* Google & Search Engine Verification */}
      <meta name="google-site-verification" content="google87bb3bc53ec346d2.html" />
      <meta name="google-site-verification" content="87bb3bc53ec346d2" />
      <meta name="msvalidate.01" content="55A817D313620EDBE729ED7B7D416DA7" />

      {/* Geographic & Local SEO (GEO) */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai, Tamil Nadu, India" />
      <meta name="geo.position" content="13.0827;80.2707" />
      <meta name="ICBM" content="13.0827, 80.2707" />

      {/* Open Graph / Facebook */}
      <meta name="theme-color" content="#1A1A2E" />
      <meta property="og:title" content="Teja Priyan World — Cyberpunk Gaming Arena" />
      <meta
        property="og:description"
        content="A cyberpunk gaming arena — forge your player card and dominate the mini-games by Teja Priyan."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://tejapriyan.github.io/Gamehub/" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Teja Priyan World — Cyberpunk Gaming Arena" />
      <meta name="twitter:description" content="A cyberpunk gaming arena — forge your player card and dominate the mini-games by Teja Priyan." />

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
