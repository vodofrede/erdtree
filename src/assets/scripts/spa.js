const router = async () => {
    const path = location.pathname;
    const html = await fetch(path).then(r => r.text());
    document.open();
    document.write(html);
    document.close();
};
const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};
const init_router = () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });
    window.addEventListener("popstate", router);
    console.log("hooked");
};

if (document.readyState !== "loading") {
    init_router();
} else {
    document.addEventListener("DOMContentLoaded", init_router);
}
