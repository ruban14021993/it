import type { ContactSettings, Branch } from "@/lib/types";

export const MOCK_CONTACT_SETTINGS: ContactSettings = {
  primary_email: "infinitymindtech@gmail.com",
  hr_email: "hr@infinitymindtech.com",
  primary_phone: "+91 8778521963",
  secondary_phone: null,
  contact_form_enabled: true,
  contact_form_recipient: "infinitymindtech@gmail.com",
  business_hours: null,
};

export const MOCK_BRANCHES: Branch[] = [
  {
    id: "b1",
    name: "Chennai",
    address: null,
    phone: null,
    email: null,
    is_primary: true,
    display_order: 1,
    is_active: true,
  },
  {
    id: "b2",
    name: "Bangalore",
    address: null,
    phone: null,
    email: null,
    is_primary: false,
    display_order: 2,
    is_active: true,
  },
  {
    id: "b3",
    name: "Thiruvananthapuram",
    address: null,
    phone: null,
    email: null,
    is_primary: false,
    display_order: 3,
    is_active: true,
  },
  {
    id: "b4",
    name: "Nagercoil",
    address: null,
    phone: null,
    email: null,
    is_primary: false,
    display_order: 4,
    is_active: true,
  },
];
