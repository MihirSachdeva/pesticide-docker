const BACK_BUTTONS = {
    ADMIN: {
        showBack: true,
        backText: "Home",
        backLink: "/"
    }, // for admin page
    HOME: {
        showBack: false,
        backText: "",
        backLink: ""
    }, // for home page
    ISSUES: {
        showBack: true,
        backText: "Home",
        backLink: "/"
    }, // for issues page
    ONLOGIN: {
        showBack: true,
        backText: "Sign in",
        backLink: "/signin"
    }, // for onlogin page
    SIGNIN: {
        showBack: false,
        backText: "",
        backLink: ""
    }, // for signin page
    PROJECT: {
        showBack: true,
        backText: "Projects",
        backLink: "/projects"
    }, // for project page
    PROJECTS: {
        showBack: true,
        backText: "Home",
        backLink: "/"
    }, // for all projects page
    SETTINGS: {
        showBack: true,
        backText: "Home",
        backLink: "/"
    }, // for settings page
    USERS: {
        showBack: true,
        backText: "Home",
        backLink: "/"
    }, // for all users page
    USER: {
        showBack: true,
        backText: "Users",
        backLink: "/users"
    }, // for user page
    ISSUE: {
        showBack: true,
        backText: "Issues",
        backLink: "/issues"
    }, // for issue page
};

export default BACK_BUTTONS;
