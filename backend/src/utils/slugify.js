const slugify = (text) => {
    return text
        .trim()
        .toLowerCase()
        .replace(/\./g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

module.exports = slugify;
