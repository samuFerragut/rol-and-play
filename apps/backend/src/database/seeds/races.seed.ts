const allSkillChoices = [
  'Acrobacias',
  'Arcanos',
  'Atletismo',
  'Engaño',
  'Historia',
  'Interpretación',
  'Intimidación',
  'Investigación',
  'Juego de Manos',
  'Medicina',
  'Naturaleza',
  'Percepción',
  'Perspicacia',
  'Persuasión',
  'Religión',
  'Sigilo',
  'Supervivencia',
  'Trato con Animales',
];

export const racesSeed = [
  {
    name: 'Enano',
    slug: 'enano',
    selectionLabel: 'Subraza',
    description:
      'Pueblo robusto, resistente y orgulloso, conocido por su fortaleza, tradición y habilidad con la piedra y el metal.',
    size: 'Mediano',
    speed: 25,
    abilityBonuses: {
      constitution: 2,
    },
    languages: ['Común', 'Enano'],
    traits: [
      'Visión en la Oscuridad',
      'Resistencia Enana',
      'Entrenamiento de Combate Enano',
      'Competencia con Herramientas',
      'Afinidad con la Piedra',
    ],
    subraces: [
      {
        name: 'Enano de las colinas',
        slug: 'enano-de-las-colinas',
        description:
          'Enano sabio y resistente, acostumbrado a una vida de tradición y perseverancia.',
        abilityBonuses: {
          wisdom: 1,
        },
        traits: ['Dureza Enana'],
        languages: [],
        imageUrl: null,
      },
      {
        name: 'Enano de las montañas',
        slug: 'enano-de-las-montanas',
        description:
          'Enano fuerte y endurecido, criado entre montañas y guerras.',
        abilityBonuses: {
          strength: 2,
        },
        traits: ['Entrenamiento con Armadura Enana'],
        languages: [],
        imageUrl: null,
      },
    ],
    imageUrl: null,
  },

  {
    name: 'Elfo',
    slug: 'elfo',
    selectionLabel: 'Subraza',
    description:
      'Raza mágica, longeva y grácil, vinculada a la naturaleza, la magia y la belleza.',
    size: 'Mediano',
    speed: 30,
    abilityBonuses: {
      dexterity: 2,
    },
    languages: ['Común', 'Élfico'],
    traits: [
      'Visión en la Oscuridad',
      'Sentidos Agudos',
      'Ascendencia Feérica',
      'Trance',
    ],
    subraces: [
      {
        name: 'Alto Elfo',
        slug: 'alto-elfo',
        description: 'Elfo refinado con afinidad natural por la magia.',
        abilityBonuses: {
          intelligence: 1,
        },
        traits: [
          'Entrenamiento con Armas Élficas',
          'Truco adicional',
          'Idioma adicional',
        ],
        languages: [],
        skillChoices: allSkillChoices,
        numberOfSkillChoices: 1,
        imageUrl: null,
      },
      {
        name: 'Elfo de los Bosques',
        slug: 'elfo-de-los-bosques',
        description: 'Elfo veloz y conectado profundamente con la naturaleza.',
        abilityBonuses: {
          wisdom: 1,
        },
        traits: ['Velocidad aumentada', 'Máscara de la Naturaleza'],
        languages: [],
        imageUrl: null,
      },
      {
        name: 'Drow',
        slug: 'drow',
        description:
          'Elfo oscuro adaptado a las profundidades y a la magia sombría.',
        abilityBonuses: {
          charisma: 1,
        },
        traits: ['Magia Drow', 'Sensibilidad Solar', 'Entrenamiento Drow'],
        languages: [],
        imageUrl: null,
      },
    ],
    imageUrl: null,
  },

  {
    name: 'Humano',
    slug: 'humano',
    selectionLabel: 'Variante humana',
    description:
      'Raza ambiciosa, adaptable y diversa, capaz de destacar en cualquier camino.',
    size: 'Mediano',
    speed: 30,
    abilityBonuses: {},
    languages: ['Común', 'Idioma adicional'],
    traits: [],
    subraces: [
      {
        name: 'Humano estándar',
        slug: 'humano-estandar',
        description: 'Humano equilibrado cuyas seis puntuaciones aumentan.',
        abilityBonuses: {
          strength: 1,
          dexterity: 1,
          constitution: 1,
          intelligence: 1,
          wisdom: 1,
          charisma: 1,
        },
        traits: ['Versatilidad Humana'],
        languages: [],
        imageUrl: null,
      },
      {
        name: 'Humano variante',
        slug: 'humano-variante',
        description: 'Variante opcional con dote y habilidad adicional.',
        abilityBonuses: {},
        traits: [
          'Dos características +1',
          'Competencia en una habilidad',
          'Una dote',
        ],
        languages: [],
        imageUrl: null,
      },
    ],
    imageUrl: null,
  },

  {
    name: 'Mediano',
    slug: 'mediano',
    selectionLabel: 'Subraza',
    description: 'Pequeños, ágiles y afortunados aventureros de gran corazón.',
    size: 'Pequeño',
    speed: 25,
    abilityBonuses: {
      dexterity: 2,
    },
    languages: ['Común', 'Mediano'],
    traits: ['Suertudo', 'Valiente', 'Agilidad Mediana'],
    subraces: [
      {
        name: 'Piesligeros',
        slug: 'piesligeros',
        description: 'Medianos sociables y extremadamente discretos.',
        abilityBonuses: {
          charisma: 1,
        },
        traits: ['Sigilo Natural'],
        languages: [],
        imageUrl: null,
      },
      {
        name: 'Fornido',
        slug: 'fornido',
        description: 'Medianos resistentes acostumbrados a la dureza.',
        abilityBonuses: {
          constitution: 1,
        },
        traits: ['Resistencia Fornida'],
        languages: [],
        imageUrl: null,
      },
    ],
    imageUrl: null,
  },

  {
    name: 'Dracónido',
    slug: 'draconido',
    selectionLabel: 'Ascendencia dracónica',
    description: 'Descendientes orgullosos de dragones con aliento elemental.',
    size: 'Mediano',
    speed: 30,
    abilityBonuses: {
      strength: 2,
      charisma: 1,
    },
    languages: ['Común', 'Dracónico'],
    traits: ['Ascendencia Dracónica', 'Arma de Aliento', 'Resistencia al Daño'],
    subraces: [
      {
        name: 'Rojo',
        slug: 'dragon-rojo',
        description: 'Ascendencia de dragón rojo. Daño de fuego.',
        abilityBonuses: {},
        traits: ['Daño: Fuego', 'Aliento: Cono 15 pies', 'Salvación: Destreza'],
        languages: [],
        imageUrl: null,
      },
      {
        name: 'Azul',
        slug: 'dragon-azul',
        description: 'Ascendencia de dragón azul. Daño de relámpago.',
        abilityBonuses: {},
        traits: [
          'Daño: Relámpago',
          'Aliento: Línea 5x30',
          'Salvación: Destreza',
        ],
        languages: [],
        imageUrl: null,
      },
      {
        name: 'Negro',
        slug: 'dragon-negro',
        description: 'Ascendencia de dragón negro. Daño de ácido.',
        abilityBonuses: {},
        traits: ['Daño: Ácido', 'Aliento: Línea 5x30', 'Salvación: Destreza'],
        languages: [],
        imageUrl: null,
      },
      {
        name: 'Blanco',
        slug: 'dragon-blanco',
        description: 'Ascendencia de dragón blanco. Daño de frío.',
        abilityBonuses: {},
        traits: [
          'Daño: Frío',
          'Aliento: Cono 15 pies',
          'Salvación: Constitución',
        ],
        languages: [],
        imageUrl: null,
      },
      {
        name: 'Verde',
        slug: 'dragon-verde',
        description: 'Ascendencia de dragón verde. Daño de veneno.',
        abilityBonuses: {},
        traits: [
          'Daño: Veneno',
          'Aliento: Cono 15 pies',
          'Salvación: Constitución',
        ],
        languages: [],
        imageUrl: null,
      },
    ],
    imageUrl: null,
  },

  {
    name: 'Gnomo',
    slug: 'gnomo',
    selectionLabel: 'Subraza',
    description: 'Pequeños inventores y magos curiosos con gran intelecto.',
    size: 'Pequeño',
    speed: 25,
    abilityBonuses: {
      intelligence: 2,
    },
    languages: ['Común', 'Gnómico'],
    traits: ['Visión en la Oscuridad', 'Astucia Gnoma'],
    subraces: [
      {
        name: 'Gnomo de los Bosques',
        slug: 'gnomo-de-los-bosques',
        description: 'Gnomo ágil y conectado con criaturas pequeñas.',
        abilityBonuses: {
          dexterity: 1,
        },
        traits: ['Ilusionista Natural', 'Hablar con Bestias Pequeñas'],
        languages: [],
        imageUrl: null,
      },
      {
        name: 'Gnomo de las Rocas',
        slug: 'gnomo-de-las-rocas',
        description: 'Gnomo inventor especializado en mecanismos.',
        abilityBonuses: {
          constitution: 1,
        },
        traits: ['Conocimiento del Artífice', 'Manitas'],
        languages: [],
        imageUrl: null,
      },
    ],
    imageUrl: null,
  },

  {
    name: 'Semielfo',
    slug: 'semielfo',
    selectionLabel: 'Linaje',
    description:
      'Nacidos entre dos mundos, combinan gracia élfica y ambición humana.',
    size: 'Mediano',
    speed: 30,
    abilityBonuses: {
      charisma: 2,
    },
    languages: ['Común', 'Élfico', 'Idioma adicional'],
    traits: [
      'Visión en la Oscuridad',
      'Ascendencia Feérica',
      'Versatilidad con Habilidades',
    ],
    skillChoices: allSkillChoices,
    numberOfSkillChoices: 2,
    subraces: [],
    imageUrl: null,
  },

  {
    name: 'Semiorco',
    slug: 'semiorco',
    selectionLabel: 'Linaje',
    description:
      'Feroces y resistentes guerreros nacidos de sangre humana y orca.',
    size: 'Mediano',
    speed: 30,
    abilityBonuses: {
      strength: 2,
      constitution: 1,
    },
    languages: ['Común', 'Orco'],
    traits: [
      'Visión en la Oscuridad',
      'Amenazante',
      'Resistencia Incansable',
      'Ataques Salvajes',
    ],
    skillProficiencies: ['Intimidación'],
    subraces: [],
    imageUrl: null,
  },

  {
    name: 'Tiflin',
    slug: 'tiflin',
    selectionLabel: 'Linaje infernal',
    description:
      'Herederos de sangre infernal con magia y resistencia sobrenaturales.',
    size: 'Mediano',
    speed: 30,
    abilityBonuses: {
      intelligence: 1,
      charisma: 2,
    },
    languages: ['Común', 'Infernal'],
    traits: [
      'Visión en la Oscuridad',
      'Resistencia Infernal',
      'Legado Infernal',
    ],
    subraces: [],
    imageUrl: null,
  },
];
