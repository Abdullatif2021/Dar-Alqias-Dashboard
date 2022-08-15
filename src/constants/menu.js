import { adminRoot } from "./config";
import { UserRole } from "../utils/auth.roles";

const data = [
  {
    id: "static",
    icon: "iconsminds-shop",
    label: "Static",
    to: `${adminRoot}/static`
  },

  {
    id: "blockCategories",
    icon: "iconsminds-picasa",
    label: "Blocks Category",
    to: `${adminRoot}/blockCategories`,
    roles: ["superadmin"]
  },
  {
    id: "categories",
    icon: "simple-icon-grid",
    label: "Categories",
    to: `${adminRoot}/categories`,
    roles: ["superadmin"]
  },
  {
    id: "auctions",
    icon: "simple-icon-folder",
    label: "Auctions",
    to: `${adminRoot}/auctions`,
    roles: ["superadmin", "admin", "accountant"]
  },
  {
    id: "Pages",
    icon: "iconsminds-digital-drawing",
    label: "Pages",
    to: `${adminRoot}/pages`,
    roles: ["superadmin", "admin", "editor"]
  },
  {
    id: "admins",
    icon: "simple-icon-user",
    label: "Admins",
    to: `${adminRoot}/admins`,
    roles: ["superadmin", "admin"]
  },
  {
    id: "faq",
    icon: "simple-icon-question",
    label: "FAQ",
    to: `${adminRoot}/faq`,
    roles: ["superadmin", "admin"],
    subs: [
      {
        icon: "simple-icon-list",
        label: "menu.list",
        to: `${adminRoot}/faq/faq_list`,
        roles: ["superadmin", "admin"]
      },
      {
        icon: "simple-icon-pie-chart",
        label: "menu.categories",
        to: `${adminRoot}/faq/categories`,
        roles: ["superadmin", "admin"]
      }
    ]
  },

  {
    id: "users",
    icon: "simple-icon-people",
    label: "Users",
    to: `${adminRoot}/users`,
    roles: ["superadmin", "admin"]
  },
  {
    id: "accountant",
    icon: "simple-icon-people",
    label: "Accountant",
    to: `${adminRoot}/accountant`,
    roles: ["superadmin", "admin"]
  },
  {
    id: "Settings",
    icon: "simple-icon-settings",
    label: "Settings",
    to: `${adminRoot}/settings`,
    roles: ["superadmin"]
  }
];
export default data;
