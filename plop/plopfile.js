const fs = require("fs");
const path = require("path");
const pluralize = require("pluralize");

const capitalizeName = (name) => {
  const words = name.trim().split(/[\s-]+/);

  const pascalName = words
    .map((word, index) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("");

  return pascalName;
};

module.exports = function (plop) {
  // Custom helper to pluralize feature names
  plop.setHelper("pluralize", (text) => pluralize(text));

  plop.setGenerator("feature", {
    description: "Generate a new feature module",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "Enter the feature name (eg., property, user, department ... ): ",
      },
    ],
    actions: [
      {
        type: "add",
        path: "../src/app/(features)/{{dashCase (pluralize name)}}/_component/new-{{dashCase name}}-component.tsx",
        templateFile: "templates/feature/_component/new-component.tsx.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "../src/app/(features)/{{dashCase (pluralize name)}}/_component/{{dashCase name}}-detail-component.tsx",
        templateFile: "templates/feature/_component/detail-component.tsx.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "../src/app/(features)/{{dashCase (pluralize name)}}/_store/{{dashCase name}}.endpoint.ts",
        templateFile: "templates/feature/_store/endpoint.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "../src/app/(features)/{{dashCase (pluralize name)}}/_store/{{dashCase name}}.query.ts",
        templateFile: "templates/feature/_store/query.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "../src/app/(features)/{{dashCase (pluralize name)}}/[id]/page.tsx",
        templateFile: "templates/feature/[id]/page.tsx.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "../src/app/(features)/{{dashCase (pluralize name)}}/detail/[id]/page.tsx",
        templateFile: "templates/feature/detail/[id]/page.tsx.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "../src/app/(features)/{{dashCase (pluralize name)}}/layout.tsx",
        templateFile: "templates/feature/layout.tsx.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "../src/app/(features)/{{dashCase (pluralize name)}}/page.tsx",
        templateFile: "templates/feature/page.tsx.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "../src/schemas/new-{{dashCase name}}-schema.ts",
        templateFile: "templates/feature/schemas/schema.ts.hbs",
        skipIfExists: true,
      },
      {
        type: "add",
        path: "../src/models/{{dashCase name}}.model.ts",
        templateFile: "templates/feature/models/model.ts.hbs",
        skipIfExists: true,
      },
      // Modify app.api.ts to add new feature tags dynamically
      {
        type: "modify",
        path: "../src/store/app.api.ts",
        transform: (fileContents, { name }) => {
          const pascalName = capitalizeName(name.trim());
          const pluralPascalName = pluralize(pascalName); // Use pluralize
          const newTags = [`"${pluralPascalName}"`, `"${pascalName}Info"`];

          // Check if the tags already exist
          const alreadyExists = newTags.every((tag) =>
            fileContents.includes(tag)
          );
          if (alreadyExists) {
            return fileContents; // Return unchanged if tags exist
          }

          // Find the tagTypes array and insert new tags
          return fileContents.replace(
            /tagTypes:\s*\[(.*?)\]/s,
            (match, existingTags) => {
              const updatedTags = new Set(
                existingTags
                  .split(",")
                  .map((tag) => tag.trim().replace(/["']/g, ""))
              );
              newTags.forEach((tag) =>
                updatedTags.add(tag.replace(/["']/g, ""))
              );

              return `tagTypes: [${Array.from(updatedTags)
                .map((tag) => `"${tag}"`)
                .join(", ")}]`;
            }
          );
        },
      },
    ],
  });
};
