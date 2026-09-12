export const Head = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://tejapriyanhub.vercel.app/#website",
        "url": "https://tejapriyanhub.vercel.app/",
        "name": "Teja Priyan GameHub",
        "description": "Cyberpunk browser gaming arena featuring 8 responsive HTML5 canvas games, Web Audio synthesizer, full screen mode, and holographic player cards.",
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://tejapriyanhub.vercel.app/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebApplication",
        "@id": "https://tejapriyanhub.vercel.app/#webapp",
        "name": "Teja Priyan GameHub Arcade",
        "url": "https://tejapriyanhub.vercel.app/",
        "applicationCategory": "GameApplication",
        "genre": ["Arcade", "Action", "Cyberpunk", "Retro"],
        "operatingSystem": "All modern web browsers (Desktop, Tablet, Mobile)",
        "browserRequirements": "Requires HTML5 Canvas and Web Audio API support",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "VideoGameSeries",
        "name": "GameHub Cyber Arena Collection",
        "numberOfItems": 8,
        "itemListElement": [
          { "@type": "VideoGame", "name": "Cyber Invaders: Neon Strike", "genre": "Space Shooter" },
          { "@type": "VideoGame", "name": "Neon Lightcycle: Grid Surfer", "genre": "Racer" },
          { "@type": "VideoGame", "name": "Neon Pulse", "genre": "Rhythm Runner" },
          { "@type": "VideoGame", "name": "Quantum Velocity", "genre": "Cyber Drift" },
          { "@type": "VideoGame", "name": "Vortex Defender", "genre": "Turret Defense" },
          { "@type": "VideoGame", "name": "Hexa Matrix", "genre": "Puzzle Breaker" },
          { "@type": "VideoGame", "name": "Cyber Slash", "genre": "Action Slicer" },
          { "@type": "VideoGame", "name": "Grav Runner", "genre": "Gravity Platformer" }
        ]
      }
    ]
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* Primary Meta Tags */}
      <title>Teja Priyan GameHub — Play Cyberpunk Browser Arcade Games</title>
      <meta
        name="title"
        content="Teja Priyan GameHub — Play Cyberpunk Browser Arcade Games"
      />
      <meta
        name="description"
        content="Step into Teja Priyan GameHub: a neon cyberpunk browser arcade featuring 8 high-performance HTML5 canvas games, real-time Web Audio synths, full screen mode, and custom 3D operative player cards."
      />
      <meta
        name="keywords"
        content="Gamehub, Cyberpunk games, browser arcade, HTML5 games, Teja Priyan GameHub, online gaming, retro arcade, canvas games, space invaders, lightcycle tron, neon games, free browser games, arcade games, web games"
      />
      <meta name="author" content="Teja Priyan GameHub" />
      <meta name="application-name" content="Teja Priyan GameHub" />
      
      {/* Canonical Link */}
      <link rel="canonical" href="https://tejapriyanhub.vercel.app/" />

      {/* Google Search Console Verification (All accounts & formats) */}
      <meta name="google-site-verification" content="google87bb3bc53ec346d2.html" />
      <meta name="google-site-verification" content="87bb3bc53ec346d2" />
      <meta name="google-site-verification" content="google2af4e1ed3191321d.html" />
      <meta name="google-site-verification" content="2af4e1ed3191321d" />

      {/* Bing Webmaster Verification */}
      <meta name="msvalidate.01" content="55A817D313620EDBE729ED7B7D416DA7" />

      {/* Geographic & Local SEO (GEO) */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai, Tamil Nadu, India" />
      <meta name="geo.position" content="13.0827;80.2707" />
      <meta name="ICBM" content="13.0827, 80.2707" />

      {/* Search Engine Robots & Crawlers */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:site_name" content="Teja Priyan GameHub" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://tejapriyanhub.vercel.app/" />
      <meta property="og:title" content="Teja Priyan GameHub — Play Cyberpunk Browser Arcade Games" />
      <meta
        property="og:description"
        content="Dive into 8 fast-paced HTML5 arcade games with zero install, instant full-screen support, Web Audio synth sounds, and custom holographic player cards."
      />
      <meta property="og:image" content="https://tejapriyanhub.vercel.app/images/games/neon-dash.jpg" />
      <meta property="og:image:secure_url" content="https://tejapriyanhub.vercel.app/images/games/neon-dash.jpg" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Teja Priyan GameHub Cyberpunk Arena Banner" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://tejapriyanhub.vercel.app/" />
      <meta name="twitter:title" content="Teja Priyan GameHub — Play Cyberpunk Browser Arcade Games" />
      <meta
        name="twitter:description"
        content="Dive into 8 fast-paced HTML5 arcade games with zero install, instant full-screen support, Web Audio synth sounds, and custom holographic player cards."
      />
      <meta name="twitter:image" content="https://tejapriyanhub.vercel.app/images/games/neon-dash.jpg" />
      <meta name="twitter:image:alt" content="Teja Priyan GameHub Cyberpunk Arena Banner" />

      {/* Theme & PWA Colors */}
      <meta name="theme-color" content="#070716" />
      <meta name="color-scheme" content="dark" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="GameHub" />
      <meta name="format-detection" content="telephone=no" />

      {/* Favicons */}
      <link rel="icon" href={`${import.meta.env.BASE_URL}favicon.ico`} sizes="any" />
      <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`} />
      <link rel="icon" type="image/png" sizes="32x32" href={`${import.meta.env.BASE_URL}favicon-32x32.png`} />
      <link rel="apple-touch-icon" href={`${import.meta.env.BASE_URL}apple-touch-icon.png`} />

      {/* Semantic JSON-LD (AEO & Rich Snippets) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Preconnect Fonts */}
      <link rel="preconnect" href="https://static.parastorage.com" />
    </>
  );
};
