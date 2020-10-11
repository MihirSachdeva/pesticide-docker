const HEADER_NAV_TITLES = {
  ADMIN: "Admin", // for admin page
  DASHBOARD: "Pesticide", // for home page
  ISSUES: "Issues", // for issues page
  ONLOGIN: "Pesticide", // for onlogin page
  SIGNIN: "Pesticide", // for signin page
  PROJECTNAME: (projectName) => projectName && (projectName.length < 9 ? projectName : projectName.match(/\b([A-Z])/g).join("")), // for project page
  PROJECTS: "Projects", // for all projects page
  SETTINGS: "Settings", // for settings page
  USERS: "Users", // for all users page
  USER: "User", // for user page
  ISSUE: "Issue", // for issue page
};

export default HEADER_NAV_TITLES;
