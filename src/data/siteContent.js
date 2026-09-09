/**
 * Site content for Golden Spoon Boutique Catering.
 * Keep presentation components free of hard-coded copy so this file
 * can later be replaced by a CMS or database source.
 *
 * Do not invent phone numbers, emails, reviews, or event details here.
 */

export const site = {
  name: "Golden Spoon Boutique Catering",
  shortName: "Golden Spoon",
  descriptor: "Boutique European Catering",
  location: "South Florida, USA",
  tagline:
    "Elegant catering experiences for South Florida’s most memorable events.",
  coreMessage:
    "Elegant Catering Experiences for South Florida’s Most Memorable Events",
  metadata: {
    title: "Golden Spoon Boutique Catering | South Florida",
    description:
      "Elegant European-inspired boutique catering for private celebrations, corporate events, yacht catering and special occasions throughout South Florida.",
  },
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/gallery", label: "Gallery" },
    { href: "/menus", label: "Menus" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  cta: {
    inquire: {
      href: "/contact",
      label: "Inquire About Your Event",
    },
    inquireShort: {
      href: "/contact",
      label: "Inquire",
    },
    services: {
      href: "/services",
      label: "View Our Services",
    },
    proposal: {
      href: "/contact",
      label: "Request Your Proposal",
    },
    story: {
      href: "/about",
      label: "Our Story",
    },
  },
  /**
   * Insert approved contact details when available.
   * Leave null until real information is confirmed.
   */
  contact: {
    phone: "786.519.2902",
    email: null,
    address: null,
    instagram: {
      handle: "@goldenspoon.events",
      href: "https://www.instagram.com/goldenspoon.events/",
    },
  },
  footer: {
    quickLinks: [
      { href: "/about", label: "About" },
      { href: "/services", label: "Services" },
      { href: "/gallery", label: "Gallery" },
      { href: "/menus", label: "Menus" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
    services: [
      "Private Parties",
      "Corporate Events",
      "Grazing Tables",
      "Yacht Catering",
      "Custom Menus",
    ],
    serviceArea: [
      "Miami-Dade",
      "Broward County",
      "Palm Beach County",
      "South Florida",
    ],
  },
};

export const home = {
  hero: {
    eyebrow: "Boutique European Catering",
    headline: ["Elegant Catering", "Experiences"],
    script: "for South Florida’s most memorable events",
    copy: "Thoughtfully crafted menus, signature presentation and personalized service for every occasion.",
    image: {
      slot: "home-hero",
      src: "/images/brand/hero-photo-approved.jpg",
      alt: "An elegant Golden Spoon catering table overlooking the water at sunset.",
    },
  },
  features: [
    {
      icon: "leaf",
      title: "Thoughtfully Crafted Menus",
      lines: ["Fresh ingredients.", "European inspiration."],
    },
    {
      icon: "cloche",
      title: "Signature Presentation",
      lines: ["Beautiful food.", "Elegant details."],
    },
    {
      icon: "people",
      title: "Personalized Service",
      lines: ["Attentive. Discreet.", "Always personal."],
    },
    {
      icon: "pin",
      title: "South Florida Expertise",
      lines: ["Miami-Dade · Broward · Palm Beach", "We come to you."],
    },
  ],
  experience: {
    eyebrow: "The Golden Spoon",
    heading: "Experience",
    script: "European elegance. Thoughtfully brought to your table.",
    copy: "At Golden Spoon, exceptional catering is more than food — it’s an experience. European inspiration, fresh ingredients, refined presentation and thoughtful service come together to create gatherings that feel effortless and memorable.",
    quote: ["Good food", "creates great moments."],
    image: {
      slot: "home-experience",
      src: "/images/home/experience-photo.jpg",
      alt: "Seared scallops plated with champagne and white flowers.",
    },
  },
  selectedServices: {
    eyebrow: "Selected Services",
    heading: "Catering, Tailored to the Occasion",
    script: "Exceptional food. Unforgettable moments.",
    copy: "From intimate gatherings to large celebrations, we create customized catering experiences with exceptional cuisine and attentive service.",
    items: [
      {
        title: "Private Parties & Celebrations",
        copy: "Thoughtfully curated events for life’s special moments.",
        image: {
          slot: "service-private",
          src: "/images/home/service-private.jpg",
          alt: "A floral table setting for a private celebration.",
        },
      },
      {
        title: "Corporate & Special Events",
        copy: "Professional catering for meetings, conferences and corporate celebrations.",
        image: {
          slot: "service-corporate",
          src: "/images/home/service-corporate.jpg",
          alt: "An elegant catering table prepared for a corporate event.",
        },
      },
      {
        title: "Cocktail Receptions",
        copy: "Elegant bites and refined presentation for stylish receptions and networking events.",
        image: {
          slot: "service-cocktail",
          src: "/images/home/service-cocktail.jpg",
          alt: "Plated appetizers prepared for a cocktail reception.",
        },
      },
      {
        title: "Yacht Catering",
        copy: "Exceptional cuisine on board, creating a unique and unforgettable experience on the water.",
        image: {
          slot: "service-yacht",
          src: "/images/home/service-yacht.jpg",
          alt: "A sunset table setting overlooking the water.",
        },
      },
    ],
    cta: {
      href: "/services",
      label: "View All Services",
    },
  },
  about: {
    eyebrow: "About Golden Spoon",
    heading: ["European Soul.", "South Florida Heart."],
    copy: [
      "Golden Spoon brings the elegance of European flavors and presentation to the vibrant lifestyle of South Florida. We believe that exceptional food has the power to bring people together, turning any occasion into a memorable experience.",
      "With a passion for quality ingredients, refined taste and personalized service, we create more than just catering — we create moments that stay with you.",
    ],
    quote: ["Good food", "brings good people", "together"],
    image: {
      slot: "home-about",
      src: "/images/home/about-photo.jpg",
      alt: "Plated scallops with champagne and flowers at a waterfront sunset table.",
    },
    cta: {
      href: "/about",
      label: "Learn More",
    },
  },
  menus: {
    eyebrow: "Our Catering Collections",
    heading: "Curated menus for every style of event.",
    copy: "From intimate gatherings to large celebrations, we offer a variety of menu options crafted with seasonal ingredients and a European touch.",
    items: [
      {
        title: "Cocktail Receptions",
        copy: "Passed hors d'oeuvres, beautiful bites.",
        image: {
          slot: "menu-cocktail",
          src: "/images/home/menu-cocktail.png",
          alt: "Passed shrimp hors d’oeuvres arranged for a cocktail reception.",
        },
      },
      {
        title: "Plated Dinners",
        copy: "Elegant multi-course experiences.",
        image: {
          slot: "menu-plated",
          src: "/images/home/menu-plated.png",
          alt: "Seared scallops plated for an elegant dinner.",
        },
      },
      {
        title: "Brunch & Day Events",
        copy: "Fresh, light and made with care.",
        image: {
          slot: "menu-brunch",
          src: "/images/home/menu-brunch.png",
          alt: "A coastal brunch table with pastries, fruit and juice.",
        },
      },
    ],
    cta: {
      href: "/menus",
      label: "Explore Menus",
    },
  },
  gallery: {
    eyebrow: "A Few Moments We’ve Created",
    heading: "Moments Worth Remembering",
    copy: "A glimpse into the events we’ve had the privilege to be part of — beautiful settings, fresh flavors and unforgettable moments.",
    images: [
      {
        slot: "gallery-preview-1",
        src: "/images/home/gallery-1.jpg",
        alt: "An outdoor sunset table with florals, candlelight and gold-rimmed place settings.",
      },
      {
        slot: "gallery-preview-2",
        src: "/images/gallery/yacht-sunset.jpg",
        alt: "Golden Spoon yacht catering at sunset with hors d’oeuvres, champagne and branded signage.",
        object: "object-[center_48%]",
      },
      {
        slot: "gallery-preview-3",
        src: "/images/gallery/victoria-setup.jpg",
        alt: "Victoria of Golden Spoon behind a plated appetizer display at an outdoor event.",
        object: "object-[center_top]",
      },
      {
        slot: "gallery-preview-4",
        src: "/images/gallery/baby-shower.jpg",
        alt: "A baby shower catering table with an Oh Baby cake, grazing board, florals and desserts.",
        object: "object-[center_38%]",
      },
    ],
    cta: {
      href: "/gallery",
      label: "View Gallery",
    },
  },
  occasions: {
    eyebrow: "Boutique Catering For",
    heading: "Every Occasion",
    items: [
      {
        title: "Private Parties & Celebrations",
        href: "/services",
        image: {
          slot: "occasion-private",
          src: null, // Replace with /images/home/occasion-private.jpg
          alt: "A floral table setting for a private celebration.",
        },
      },
      {
        title: "Corporate & Special Events",
        href: "/services",
        image: {
          slot: "occasion-corporate",
          src: null, // Replace with /images/home/occasion-corporate.jpg
          alt: "Champagne service prepared for a corporate event.",
        },
      },
      {
        title: "Grazing Tables & Stations",
        href: "/services",
        image: {
          slot: "occasion-grazing",
          src: null, // Replace with /images/home/occasion-grazing.jpg
          alt: "A bountiful grazing table arrangement.",
        },
      },
      {
        title: "Yacht Catering",
        href: "/services",
        image: {
          slot: "occasion-yacht",
          src: null, // Replace with /images/home/occasion-yacht.jpg
          alt: "Yacht catering on the water.",
        },
      },
      {
        title: "Custom Menus & More",
        href: "/services",
        image: {
          slot: "occasion-custom",
          src: null, // Replace with /images/home/occasion-custom.jpg
          alt: "A custom plated dish by Golden Spoon Boutique Catering.",
        },
      },
    ],
  },
};

export const aboutPage = {
  hero: {
    eyebrow: "About Golden Spoon",
    heading: ["More Than", "Catering"],
    copy: ["Exceptional food. Genuine hospitality.", "Unforgettable moments."],
    image: {
      slot: "about-hero",
      src: "/images/about/hero.jpg",
      alt: "A long outdoor banquet table with florals, candlelight and gold-rimmed settings at sunset.",
    },
  },
  story: {
    eyebrow: "Our Story",
    heading: ["Boutique Catering,", "Made Personal"],
    copy: [
      "Golden Spoon Boutique Catering creates elegant, thoughtfully crafted catering experiences for private celebrations, corporate events and special occasions throughout South Florida.",
      "Founded by Svitlana Shepovalova, Golden Spoon is built on more than 15 years of experience in the restaurant and hospitality industry. Inspired by European hospitality, we bring together thoughtfully prepared food, refined presentation and personal attention to every detail.",
    ],
    image: {
      slot: "about-story",
      src: "/images/about/svitlana.jpg",
      alt: "Svitlana Shepovalova standing behind a Golden Spoon catering display.",
    },
  },
  values: [
    {
      icon: "leaf",
      title: "Quality Ingredients",
      lines: ["We source the freshest,", "highest quality ingredients."],
    },
    {
      icon: "cloche",
      title: "European Inspiration",
      lines: ["Classic flavors with", "a modern touch."],
    },
    {
      icon: "people",
      title: "Personalized Service",
      lines: ["Every event is unique,", "just like our approach."],
    },
    {
      icon: "chef",
      title: "Memorable Experiences",
      lines: ["Beautiful food, elegant details", "and moments that last."],
    },
  ],
  approach: {
    eyebrow: "Our Approach",
    heading: ["Details Make", "the Difference"],
    copy: [
      "We believe every event should feel personal. From the menu and presentation to the final details, each experience is thoughtfully tailored to the occasion, the setting and the people we serve.",
      "Our goal is simple — to make every gathering feel special.",
    ],
    cta: {
      href: "/contact",
      label: "Let’s Plan Your Event",
    },
    image: {
      slot: "about-approach",
      src: "/images/about/approach.jpg",
      alt: "An outdoor waterfront dinner table with florals, candlelight and gold place settings at sunset.",
    },
  },
  cta: {
    eyebrow: "Ready to Create Something Special?",
    heading: "We’d love to be a part of your next event.",
  },
};

export const servicesPage = {
  hero: {
    eyebrow: "Selected Services",
    heading: ["Catering, Tailored", "to the Occasion"],
    lead: "Exceptional food. Unforgettable moments.",
    copy: "From intimate gatherings to large celebrations, we create customized catering experiences with exceptional cuisine and attentive service.",
    cta: {
      href: "/contact",
      label: "Inquire Now",
    },
    image: {
      slot: "services-hero",
      src: "/images/services/hero.jpg",
      alt: "A waterfront catering table with gold-rimmed place settings, florals and hors d’oeuvres at sunset.",
    },
  },
  items: [
    {
      number: "01",
      title: ["Private Parties", "& Celebrations"],
      copy: "Intimate gatherings with exceptional food and personalized service.",
      image: {
        slot: "service-01",
        src: "/images/services/private-parties.jpg",
        alt: "A floral table setting for a private celebration.",
      },
    },
    {
      number: "02",
      title: ["Birthdays &", "Anniversaries"],
      copy: "Memorable celebrations with exquisite cuisine and elegant presentation.",
      image: {
        slot: "service-02",
        src: "/images/services/birthdays-anniversaries.jpg",
        alt: "An outdoor sunset table with florals, candlelight and gold-rimmed place settings.",
      },
    },
    {
      number: "03",
      title: ["Baby Showers &", "Bridal Showers"],
      copy: "Beautifully curated menus for life’s special moments.",
      image: {
        slot: "service-03",
        src: "/images/services/baby-bridal-showers.jpg",
        alt: "A baby shower table with an Oh Baby cake, pink florals, gifts and a teddy bear.",
      },
    },
    {
      number: "04",
      title: ["Corporate &", "Special Events"],
      copy: "Professional catering for business gatherings, conferences and special occasions.",
      image: {
        slot: "service-04",
        src: "/images/services/corporate-events.jpg",
        alt: "An elegant catering table prepared for a corporate event.",
      },
    },
    {
      number: "05",
      title: ["Cocktail Receptions"],
      copy: "Sophisticated small bites and elegant presentations for any event.",
      image: {
        slot: "service-05",
        src: "/images/services/cocktail-receptions.jpg",
        alt: "Plated appetizers prepared for a cocktail reception.",
      },
    },
    {
      number: "06",
      title: ["Yacht Catering"],
      copy: "Exceptional cuisine for unforgettable moments on the water.",
      image: {
        slot: "service-06",
        src: "/images/home/service-yacht.jpg",
        alt: "A sunset table setting overlooking the water.",
      },
    },
    {
      number: "07",
      title: ["Grazing Tables &", "Stations"],
      copy: "Beautifully designed displays with a variety of flavors and textures.",
      image: {
        slot: "service-07",
        src: "/images/services/grazing-board.jpg",
        alt: "A coastal brunch table with pastries, fruit and juice.",
      },
    },
    {
      number: "08",
      title: ["Custom Menus"],
      copy: "Tailored menus to match your vision, preferences and dietary needs.",
      image: {
        slot: "service-08",
        src: "/images/about/story.jpg",
        alt: "A chef finishing a plated scallop dish with microgreens.",
      },
    },
    {
      number: "09",
      title: ["Elegant Food &", "Table Presentation"],
      copy: "A refined aesthetic that transforms every event into a memorable experience.",
      image: {
        slot: "service-09",
        src: "/images/services/table-presentation.jpg",
        alt: "An outdoor waterfront dinner table with florals, candlelight and gold place settings at sunset.",
      },
    },
  ],
  strip: [
    {
      icon: "chef",
      title: "Custom Menus",
      lines: ["Tailored to your event", "and preferences."],
    },
    {
      icon: "cloche",
      title: "Full-Service Catering",
      lines: ["From preparation to", "presentation and service."],
    },
    {
      icon: "leaf",
      title: "Elegant Presentation",
      lines: ["Thoughtful details for", "a refined experience."],
    },
    {
      icon: "pin",
      title: "South Florida Service",
      lines: ["Miami-Dade • Broward • Palm Beach"],
    },
  ],
  cta: {
    eyebrow: "Let’s Create Something Special",
    heading: "Inquire About Your Event",
    button: {
      href: "/contact",
      label: "Contact Us",
    },
  },
};

export const galleryPage = {
  hero: {
    eyebrow: "Our Work",
    heading: ["Moments,", "Beautifully Served"],
    copy: "A glimpse into the events, tables and experiences created by Golden Spoon.",
    image: {
      slot: "gallery-hero",
      src: "/images/gallery/baby-shower.jpg",
      alt: "A baby shower catering table with an Oh Baby cake, grazing board, florals and desserts.",
    },
  },
  strip: [
    {
      icon: "people",
      title: "Private Events",
      lines: ["Intimate celebrations", "& special moments."],
    },
    {
      icon: "cloche",
      title: "Corporate Events",
      lines: ["Professional events with", "refined presentation."],
    },
    {
      icon: "boat",
      title: "Yacht Catering",
      lines: ["Elevated dining", "experiences on the water."],
    },
    {
      icon: "platter",
      title: "Signature Tables",
      lines: ["Grazing tables & elegant", "food presentation."],
    },
  ],
  // Temporary placeholder events for the public Gallery layout.
  // Replace with real events when the admin CMS is connected.
  events: [
    {
      id: "placeholder-private-dinner",
      title: "Private Birthday Dinner",
      date: "August 2026",
      location: "Miami Beach",
      description:
        "Intimate birthday celebration with a custom European-inspired menu and elegant table presentation.",
      sort_order: 1,
      photos: [
        {
          id: "placeholder-private-dinner-1",
          image_url: "/images/gallery/grazing-table.jpg",
          alt_text: "A grazing table with cheeses, fruit, sliders and canapés.",
          sort_order: 1,
        },
        {
          id: "placeholder-private-dinner-2",
          image_url: "/images/gallery/baby-shower.jpg",
          alt_text: "A celebration table with cake, grazing board, florals and desserts.",
          sort_order: 2,
        },
        {
          id: "placeholder-private-dinner-3",
          image_url: "/images/gallery/victoria-setup.jpg",
          alt_text: "Plated appetizer display at an outdoor event.",
          sort_order: 3,
        },
      ],
    },
    {
      id: "placeholder-waterfront",
      title: "Waterfront Reception",
      date: "June 2026",
      location: "South Florida",
      description:
        "An outdoor reception with refined table presentation beside the water.",
      sort_order: 2,
      photos: [
        {
          id: "placeholder-waterfront-1",
          image_url: "/images/gallery/yacht-sunset.jpg",
          alt_text: "Waterfront catering at sunset with hors d’oeuvres and champagne.",
          sort_order: 1,
        },
        {
          id: "placeholder-waterfront-2",
          image_url: "/images/gallery/yacht-portrait.jpg",
          alt_text: "A waterfront table setting with the marina beyond.",
          sort_order: 2,
        },
        {
          id: "placeholder-waterfront-3",
          image_url: "/images/gallery/uzvar-spritz.jpg",
          alt_text: "A beverage dispenser with parfait cups on a catering table.",
          sort_order: 3,
        },
      ],
    },
    {
      id: "placeholder-styled-celebration",
      title: "Styled Celebration",
      date: "July 2026",
      location: "",
      description:
        "A styled celebration with custom menu presentation and thoughtful table details.",
      sort_order: 3,
      photos: [
        {
          id: "placeholder-styled-1",
          image_url: "/images/gallery/fashion4ukraine-menu.jpg",
          alt_text: "A custom menu card on a styled catering table.",
          sort_order: 1,
        },
        {
          id: "placeholder-styled-2",
          image_url: "/images/gallery/fashion-attendees.jpg",
          alt_text: "Guests gathered at a styled indoor celebration.",
          sort_order: 2,
        },
        {
          id: "placeholder-styled-3",
          image_url: "/images/gallery/fashion-mannequins.jpg",
          alt_text: "A fashion display beside an event setup.",
          sort_order: 3,
        },
        {
          id: "placeholder-styled-4",
          image_url: "/images/gallery/uzvar-spritz.jpg",
          alt_text: "A beverage station with dessert cups.",
          sort_order: 4,
        },
      ],
    },
  ],
  images: [
    {
      slot: "gallery-yacht-sunset",
      src: "/images/gallery/yacht-sunset.jpg",
      alt: "Golden Spoon yacht catering at sunset with hors d’oeuvres, champagne and branded signage.",
      object: "object-[center_48%]",
      desktop: "col-span-2 lg:col-span-8 lg:h-[360px]",
      mobile: "aspect-[16/10] lg:aspect-auto",
    },
    {
      slot: "gallery-victoria",
      src: "/images/gallery/victoria-setup.jpg",
      alt: "Victoria of Golden Spoon behind a plated appetizer display at an outdoor event.",
      object: "object-[center_16%]",
      desktop: "col-span-1 lg:col-span-4 lg:h-[360px]",
      mobile: "aspect-[3/4] lg:aspect-auto",
    },
    {
      slot: "gallery-uzvar",
      src: "/images/gallery/uzvar-spritz.jpg",
      alt: "Ukrainian Uzvar Spritz dispenser with Golden Spoon signage and parfait cups.",
      object: "object-center",
      desktop: "col-span-1 order-3 lg:order-4 lg:col-span-5 lg:h-[340px]",
      mobile: "aspect-[3/4] lg:aspect-auto",
    },
    {
      slot: "gallery-baby-shower",
      src: "/images/gallery/baby-shower.jpg",
      alt: "A baby shower catering table with an Oh Baby cake, grazing board, florals and desserts.",
      object: "object-[center_38%]",
      desktop: "col-span-2 order-4 lg:order-3 lg:col-span-7 lg:h-[340px]",
      mobile: "aspect-[16/11] lg:aspect-auto",
    },
    {
      slot: "gallery-grazing",
      src: "/images/gallery/grazing-table.jpg",
      alt: "A grazing table with cheeses, fruit, sliders and canapés.",
      object: "object-center",
      desktop: "col-span-2 lg:col-span-8 lg:h-[220px]",
      mobile: "aspect-[21/9] lg:aspect-auto",
    },
    {
      slot: "gallery-promo",
      src: "/images/gallery/fashion4ukraine-menu.jpg",
      alt: "Fashion 4 Ukraine x Miami Swim Week menu card by Golden Spoon.",
      object: "object-[center_20%]",
      desktop: "col-span-1 lg:col-span-4 lg:h-[220px]",
      mobile: "aspect-[3/4] lg:aspect-auto",
    },
    {
      slot: "gallery-attendees",
      src: "/images/gallery/fashion-attendees.jpg",
      alt: "Guests in traditional Ukrainian attire at a Fashion 4 Ukraine event.",
      object: "object-[center_18%]",
      desktop: "col-span-1 lg:col-span-4 lg:h-[250px]",
      mobile: "aspect-[3/4] lg:aspect-auto",
    },
    {
      slot: "gallery-mannequins",
      src: "/images/gallery/fashion-mannequins.jpg",
      alt: "Ukrainian fashion display mannequins at a Fashion 4 Ukraine exhibition.",
      object: "object-[center_28%]",
      desktop: "col-span-1 lg:col-span-4 lg:h-[250px]",
      mobile: "aspect-[3/4] lg:aspect-auto",
    },
    {
      slot: "gallery-yacht-portrait",
      src: "/images/gallery/yacht-portrait.jpg",
      alt: "Yacht catering by Golden Spoon, with a waterfront table and marina beyond.",
      object: "object-[center_12%]",
      desktop: "col-span-1 lg:col-span-4 lg:h-[250px]",
      mobile: "aspect-[3/4] lg:aspect-auto",
    },
  ],
  cta: {
    eyebrow: "Let’s Create Your Event",
    heading: "Ready to create something memorable?",
    copy: "Tell us about your occasion and we'll create a catering experience tailored to you.",
    button: {
      href: "/contact",
      label: "Inquire About Your Event",
    },
  },
};

export const menusPage = {
  hero: {
    eyebrow: "Our Menus",
    heading: ["Crafted for", "Your Occasion"],
    copy: "Thoughtfully planned menus inspired by European flavors and tailored to each event.",
    image: {
      slot: "menus-hero",
      src: "/images/menus/hero.jpg",
      alt: "Herb-crusted lamb with roasted vegetables plated for a fine-dining course.",
    },
  },
  strip: [
    {
      icon: "cloche",
      title: "European Inspired",
      lines: ["Classic flavors with", "a modern touch."],
    },
    {
      icon: "leaf",
      title: "Fresh Ingredients",
      lines: ["Thoughtfully selected", "for every event."],
    },
    {
      icon: "chef",
      title: "Custom Menus",
      lines: ["Tailored to your occasion", "and preferences."],
    },
    {
      icon: "platter",
      title: "Beautiful Presentation",
      lines: ["Every detail", "thoughtfully presented."],
    },
  ],
  collections: {
    eyebrow: "Catering Collections",
    heading: ["Menus designed", "around your event"],
    copy: "Every event is different. Our menus are thoughtfully planned around the occasion, setting and preferences of each client.",
    items: [
      {
        number: "01",
        title: "Private Events",
        note: "Menu details coming soon.",
        image: {
          slot: "menu-private",
          src: "/images/home/service-private.jpg",
          alt: "A floral table setting for a private celebration.",
        },
      },
      {
        number: "02",
        title: "Corporate Events",
        note: "Menu selection available upon request.",
        image: {
          slot: "menu-corporate",
          src: "/images/home/service-corporate.jpg",
          alt: "An elegant catering table prepared for a corporate event.",
        },
      },
      {
        number: "03",
        title: "Cocktail Receptions",
        note: null,
        image: {
          slot: "menu-cocktail-page",
          src: "/images/home/menu-cocktail.png",
          alt: "Passed shrimp hors d’oeuvres arranged for a cocktail reception.",
        },
      },
      {
        number: "04",
        title: "Yacht Catering",
        note: null,
        image: {
          slot: "menu-yacht",
          src: "/images/home/service-yacht.jpg",
          alt: "A sunset table setting overlooking the water.",
        },
      },
    ],
  },
  custom: {
    eyebrow: "Personalized for You",
    heading: ["Looking for", "Something Different?"],
    copy: "Tell us about your event, preferences and vision. Golden Spoon can create a menu tailored specifically to your occasion.",
    cta: {
      href: "/contact",
      label: "Request a Custom Menu",
    },
    image: {
      slot: "menu-custom",
      src: "/images/home/menu-plated.png",
      alt: "Seared scallops plated for an elegant dinner.",
    },
  },
  cta: {
    eyebrow: "Let’s Create Your Menu",
    heading: "Let’s create your menu",
    copy: "Tell us about your event and we'll help create a catering experience tailored to you.",
    button: {
      href: "/contact",
      label: "Inquire About Your Event",
    },
  },
};

export const faqPage = {
  hero: {
    eyebrow: "Frequently Asked Questions",
    heading: ["Everything You", "Need to Know"],
    copy: "Helpful information about Golden Spoon catering, services and planning your event.",
    image: {
      slot: "faq-hero",
      src: "/images/home/service-corporate.jpg",
      alt: "An elegant catering table prepared for a corporate event.",
    },
  },
  strip: [
    {
      icon: "pin",
      title: "Service Area",
      lines: ["Miami-Dade • Broward • Palm Beach"],
    },
    {
      icon: "cloche",
      title: "Event Types",
      lines: ["Private • Corporate • Yacht • Celebrations"],
    },
    {
      icon: "chef",
      title: "Custom Menus",
      lines: ["Menus tailored to each occasion"],
    },
    {
      icon: "people",
      title: "Personal Service",
      lines: ["From inquiry to event day"],
    },
  ],
  intro: {
    eyebrow: "Questions & Answers",
    heading: "Planning Your Event",
    copy: "A few helpful answers as you begin planning your Golden Spoon experience.",
  },
  items: [
    {
      question: "What types of events does Golden Spoon cater?",
      answer:
        "Golden Spoon provides catering for private parties and celebrations, birthdays and anniversaries, baby and bridal showers, corporate and special events, cocktail receptions, yacht events and other customized occasions.",
    },
    {
      question: "What areas does Golden Spoon serve?",
      answer: "Golden Spoon serves Miami-Dade, Broward and Palm Beach.",
    },
    {
      question: "Can the menu be customized for my event?",
      answer:
        "Yes. Golden Spoon creates catering around each event. We tailor the menu and presentation to the type of occasion, guest count, your preferences, the service format and your overall vision. Share what you’re planning, and we’ll shape an experience that feels personal to you.",
    },
    {
      question: "Do you offer yacht catering?",
      answer:
        "Yes. Golden Spoon provides yacht catering. For each event, we coordinate the menu, presentation, delivery and service logistics, guest count, timing and the yacht’s requirements. Logistics that depend on the specific yacht or location are confirmed during the planning process.",
    },
    {
      question: "Do you provide catering for corporate events?",
      answer:
        "Yes. Golden Spoon provides catering for corporate and special events, including meetings, conferences and corporate celebrations.",
    },
    {
      question: "Do you offer grazing tables and food stations?",
      answer:
        "Yes. Golden Spoon offers grazing tables and food stations as part of its catering services. The format, selection and presentation can be tailored to the type of event, number of guests and overall style of the occasion.",
    },
    {
      question: "Do you provide food and table presentation?",
      answer:
        "Yes. Elegant food and table presentation is an important part of the Golden Spoon experience. We thoughtfully coordinate presentation details to complement the style and atmosphere of each event.",
    },
    {
      question: "Is staffed service available?",
      answer:
        "Yes. Staffed service is available as one of Golden Spoon’s service options. Drop-off catering delivers the food for your event; staffed service includes on-site team support. The appropriate format is determined based on your occasion, and staffing requirements are discussed and included in the proposal.",
    },
    {
      question: "How do I get started?",
      answer:
        "Send us an inquiry with the basic details of your event. We’ll discuss your occasion, preferences and catering needs, then prepare a personalized proposal for your review.",
    },
    {
      question: "How do payments work?",
      answer:
        "Payment is arranged according to your approved proposal. Event dates are confirmed upon approval of the proposal and receipt of a 50% deposit. Submission of an inquiry does not reserve your date. The remaining balance is paid according to the terms outlined in the approved proposal.",
    },
  ],
  cta: {
    eyebrow: "Still Have Questions?",
    heading: "Let’s Talk About Your Event",
    copy: "Tell us what you’re planning and we’ll help you with the next steps.",
    button: {
      href: "/contact",
      label: "Inquire About Your Event",
    },
  },
};

export const contactPage = {
  hero: {
    eyebrow: "Get in Touch",
    heading: ["Let’s Plan", "Your Event"],
    copy: "Tell us a little about your occasion and we’ll help you create a catering experience tailored to you.",
    image: {
      slot: "contact-hero",
      src: "/images/home/service-private.jpg",
      alt: "A floral table setting prepared for a private celebration.",
    },
  },
  strip: [
    {
      icon: "pin",
      title: "Service Area",
      lines: ["Miami-Dade · Broward · Palm Beach"],
    },
    {
      icon: "phone",
      title: "Phone",
      lines: ["786.519.2902"],
      href: "tel:7865192902",
    },
    {
      icon: "envelope",
      title: "Email",
      lines: ["EMAIL TO BE ADDED"],
    },
    {
      icon: "instagram",
      title: "Follow Us",
      lines: ["@goldenspoon.events"],
      href: "https://www.instagram.com/goldenspoon.events/",
      external: true,
    },
  ],
  inquiry: {
    eyebrow: "Event Inquiry",
    heading: ["Tell Us About", "Your Occasion"],
    copy: "Share a few details about your event and we’ll use them to better understand what you’re planning.",
    note: "We look forward to learning more about your event.",
    eventTypes: [
      { value: "", label: "Select event type" },
      { value: "private-celebration", label: "Private Party / Celebration" },
      { value: "birthday-anniversary", label: "Birthday / Anniversary" },
      { value: "shower", label: "Baby Shower / Bridal Shower" },
      { value: "corporate", label: "Corporate / Special Event" },
      { value: "cocktail", label: "Cocktail Reception" },
      { value: "yacht", label: "Yacht Catering" },
      { value: "grazing", label: "Grazing Table / Station" },
      { value: "other", label: "Other" },
    ],
    serviceTypes: [
      { value: "", label: "Select service type" },
      { value: "drop-off", label: "Drop-Off Catering" },
      { value: "full-service", label: "Full-Service Catering" },
      { value: "staffed", label: "Staffed Service" },
      { value: "not-sure", label: "Not Sure — I’d Like a Recommendation" },
    ],
    budgetOptions: [
      { value: "", label: "Select budget" },
      { value: "under-1000", label: "Under $1,000" },
      { value: "1000-2500", label: "$1,000 – $2,500" },
      { value: "2500-5000", label: "$2,500 – $5,000" },
      { value: "5000-10000", label: "$5,000 – $10,000" },
      { value: "10000-plus", label: "$10,000+" },
      { value: "not-sure", label: "Not Sure Yet" },
    ],
    bookingNotice:
      "Submitting an inquiry does not reserve your event date. Your date is confirmed upon approval of the proposal and receipt of the required deposit.",
    success: {
      eyebrow: "Thank You",
      copy: "Thank you for contacting Golden Spoon. Your inquiry has been received. We’ll review your event details and get back to you shortly.",
      note: "Please note: submitting an inquiry does not reserve your event date.",
    },
  },
  serviceArea: {
    eyebrow: "Serving South Florida",
    heading: ["We Bring the", "Experience to You"],
    copy: "Golden Spoon provides catering throughout Miami-Dade, Broward and Palm Beach.",
    support:
      "From private celebrations to corporate events and yacht catering, each experience is planned around the occasion.",
    image: {
      slot: "contact-service-area",
      src: "/images/gallery/yacht-sunset.jpg",
      alt: "Golden Spoon yacht catering at sunset with hors d’oeuvres, champagne and branded signage.",
    },
  },
  closing: {
    eyebrow: "Golden Spoon",
    heading: ["Elegantly Crafted.", "Beautifully Served."],
  },
};
