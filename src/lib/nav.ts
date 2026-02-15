export const navLinks = [
    { name: "Home", href: "/" },
    {
        name: "About",
        href: "/about",
        children: [
            { name: "Our Vision", href: "/about" },
            { name: "Ministries", href: "/about#ministries" },
            { name: "Leadership", href: "/about#leadership" }
        ]
    },
    { name: "Sermons", href: "/sermons" },
    { name: "Events", href: "/events" },
    { name: "Give", href: "/give" },
    {
        name: "Media",
        href: "/media",
        children: [
            { name: "Blog", href: "/blog" },
            { name: "Gallery", href: "/gallery" }
        ]
    },
    { name: "Contact", href: "/contact" },
];
