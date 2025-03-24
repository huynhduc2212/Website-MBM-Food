const slugify = require("slugify");

const generateSlug = function (next) {
  if (!this.slug) {
    if (this.name) {
      this.slug = slugify(this.name, { lower: true, strict: true });
    } else if (this.title) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
  }
  next();
};

module.exports = generateSlug;
