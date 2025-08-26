import { Extension } from "@tiptap/core";

export const allowedFontsFamilies = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Garamond",
  "Times New Roman",
  "Verdana",
  "Tahoma",
  "Courier New",
  "Consolas",
  "Trebuchet MS",
  "Montserrat",
  "Roboto",
  "Open Sans",
  "Lato",
  "Poppins",
  "Playfair Display",
  "Merriweather",
  "Nunito",
  "Fira Code",
  "JetBrains Mono",
  "Pacifico",
  "Lobster",
];

export const FontFamily = Extension.create({
  name: "fontFamily",
  addOptions() {
    return {
      types: ["textStyle"],
      defaultFont: "Times New Roman",
      allowedFonts: [...allowedFontsFamilies],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: this.options.defaultFont,
            parseHTML: (element) => element.style.fontFamily,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {};
              return { style: `font-family: ${attributes.fontFamily};` };
            },
          },
        },
      },
    ];
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCommands(): any {
    return {
      setFontFamily:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fontFamily: any) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ({ chain }: any) => {
            return chain().updateAttributes("textStyle", { fontFamily }).run();
          },
    };
  },
});
