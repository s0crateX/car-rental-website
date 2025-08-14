import Script from 'next/script';

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GenRide Portal",
    "description": "Comprehensive car rental management platform for General Santos City. Manage fleet operations, user accounts, document verification, and rental bookings with advanced admin dashboard.",
    "url": "https://www.genride-portal.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "category": "Car Rental Management Software"
    },
    "provider": {
      "@type": "Organization",
      "name": "GenRide",
      "url": "https://www.genride-portal.com",
      "logo": "https://www.genride-portal.com/assets/images/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "General Santos City",
        "addressCountry": "Philippines"
      },
      "areaServed": {
        "@type": "City",
        "name": "General Santos City",
        "containedInPlace": {
          "@type": "Country",
          "name": "Philippines"
        }
      },
      "serviceType": "Car Rental Management"
    },
    "featureList": [
      "Fleet Management",
      "User Account Management",
      "Document Verification",
      "Booking Administration",
      "Real-time Analytics",
      "Automated Workflows",
      "Secure Document Management",
      "Mobile-responsive Dashboard"
    ],
    "screenshot": "https://www.genride-portal.com/assets/images/logo.png",
    "softwareVersion": "1.0.0",
    "datePublished": "2024-12-19",
    "dateModified": "2024-12-19",
    "author": {
      "@type": "Organization",
      "name": "GenRide Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "GenRide",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.genride-portal.com/assets/images/logo.png"
      }
    }
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}

export function LocalBusinessStructuredData() {
  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.genride-portal.com/#business",
    "name": "GenRide Car Rental",
    "description": "Professional car rental services in General Santos City with comprehensive fleet management and booking system.",
    "url": "https://www.genride-portal.com",
    "telephone": "+63-XXX-XXX-XXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "General Santos City",
      "addressLocality": "General Santos City",
      "addressRegion": "South Cotabato",
      "addressCountry": "Philippines"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.1164",
      "longitude": "125.1716"
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "priceRange": "$$",
    "servedCuisine": [],
    "serviceArea": {
      "@type": "City",
      "name": "General Santos City"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Car Rental Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Car Rental",
            "description": "Reliable and affordable car rental services"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Fleet Management",
            "description": "Professional fleet management services"
          }
        }
      ]
    },
    "logo": "https://www.genride-portal.com/assets/images/logo.png",
    "image": "https://www.genride-portal.com/assets/images/logo.png",
    "sameAs": [
      "https://www.genride-portal.com"
    ]
  };

  return (
    <Script
      id="local-business-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessData),
      }}
    />
  );
}