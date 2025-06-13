const { DateTime } = require("luxon");
const slugify = require("slugify");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy('src/assets/style.css');
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/_data');

  // Blog collection
  eleventyConfig.addCollection('blog', function(collectionApi) {
    return collectionApi
      .getFilteredByGlob('src/blog/*.md')
      .sort((a, b) => b.data.date - a.data.date);
  });

  // Add absoluteUrl filter for canonical URLs
  eleventyConfig.addFilter('absoluteUrl', function(relativeUrl, baseUrl) {
    // Ensure the base URL is defined (from metadata or fallback)
    const siteBaseUrl = baseUrl || 'https://kentuckybikelawyer.com';
    // Remove trailing slash from base URL and leading slash from relative URL
    const cleanBase = siteBaseUrl.replace(/\/$/, '');
    const cleanRelative = relativeUrl.replace(/^\//, '');
    // Combine and return the absolute URL
    return new URL(cleanRelative, cleanBase).toString();
  });

  // Filter to get the index of the current post
  eleventyConfig.addFilter('getIndex', function(collection, url) {
    return collection.findIndex(post => post.url === url);
  });

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    return slugify(str, {
      lower: true,
      strict: true,
      remove: /[']/g,
    });
  });

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  
  return {
    dir: {
      input: "src",
      output: "public",
    }
  };
}