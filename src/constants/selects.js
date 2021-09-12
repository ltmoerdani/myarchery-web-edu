const eventLocationType = [
  {
    id: "Indoor",
    label: "Indoor",
  },
  {
    id: "Outdoor",
    label: "Outdoor",
  },
  {
    id: "Both",
    label: "Both",
  },
];

const eventAvailableRegistrationFee = [
  {
    id: "normal",
    label: "Normal",
    checked: true,
    fixed: true,
  },
  {
    id: "early_bird",
    label: "Early Bird",
    checked: false,
    fixed: false,
  },
];

const teamCategories = [
  {
    id: "individu",
    label: "Individu",
  },
  {
    id: "mix_team",
    label: "Mix Team",
  },
  {
    id: "male_team",
    label: "Male Team",
  },
  {
    id: "female_team",
    label: "Female Team",
  },
];

const confirmation = [
  {
    id: "1",
    label: "Iya",
  },
  {
    id: "0",
    label: "Tidak",
  },
];

const eventAudiences = [
  {
    id: "public",
    label: "public",
  },
  {
    id: "specific",
    label: "Audience tertentu",
  },
];

const eventPublishTime = [
  {
    id: "now",
    label: "Sekarang",
  },
  {
    id: "scheduled",
    label: "Jadwalkan",
  },
];

const fulldayAudience = [
  {
    id: "Individu",
    label: "Individu"
  },
  {
    id: "Tim",
    label: "Tim"
  },
]

const gender = [
  {
    id: "Male",
    label: "Laki-laki"
  },
  {
    id: "Female",
    label: "Perempuan"
  },
]

export default {
  eventLocationType,
  eventAvailableRegistrationFee,
  teamCategories,
  confirmation,
  eventAudiences,
  eventPublishTime,
  fulldayAudience,
  gender,
};