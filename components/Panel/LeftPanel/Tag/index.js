
import Tags from './Tags';

export function TagComponent({gridStyle, onSelect, tag}) {



    return <><Tags gridStyle={gridStyle} tag={tag} onSelect={onSelect} /></>
   
};

// {
//     "tag": "table",
//     "type": "layout",
//     "layout": "table",
//     "notaccept": [
//       "main",
//       "section",
//       "table",
//       "header",
//       "nav",
//       "footer"
//     ],
//     "html": "<svg viewBox=\"0 0 800 650\" xmlns=\"http://www.w3.org/2000/svg\">\n\n     <!--Background color-->\n   <rect x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" fill=\"#333\" />\n  \n  <rect x=\"5%\" y=\"5%\" width=\"95%\" height=\"95%\" fill=\"#555\" stroke=\"#fff\" stroke-dasharray=\"5\" stroke-width=\"2\" rx=\"10\" />\n\n  <rect x=\"50\" y=\"50\" width=\"700\" height=\"100\" fill=\"#333\" stroke=\"#fff\" stroke-dasharray=\"5\" stroke-width=\"2\" rx=\"10\" />\n  <text x=\"400\" y=\"100\" fill=\"#fff\" font-size=\"36\" text-anchor=\"middle\" alignment-baseline=\"middle\"> Table Header</text>\n\n    <rect x=\"50\" y=\"160\" width=\"700\" height=\"330\" fill=\"#333\" stroke=\"#fff\" stroke-dasharray=\"5\" stroke-width=\"2\" rx=\"10\" />\n  <text x=\"400\" y=\"320\" fill=\"#fff\" font-size=\"72\" text-anchor=\"middle\" alignment-baseline=\"middle\"> Table</text>\n  \n <g transform=\"translate(0, 80)\" style=\"opacity: 0.2\">\n    <line x1=\"50\" y1=\"150\" x2=\"750\" y2=\"150\" stroke=\"#fff0c\" stroke-width=\"1\"/>\n  <line x1=\"50\" y1=\"200\" x2=\"750\" y2=\"200\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <line x1=\"50\" y1=\"250\" x2=\"750\" y2=\"250\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <line x1=\"50\" y1=\"300\" x2=\"750\" y2=\"300\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <text x=\"70\" y=\"180\" fill=\"#ccc\" font-size=\"24\">Row 1</text>\n  <text x=\"70\" y=\"235\" fill=\"#ccc\" font-size=\"24\">Row 2</text>\n  <text x=\"70\" y=\"285\" fill=\"#ccc\" font-size=\"24\">Row 3</text>\n  <text x=\"70\" y=\"335\" fill=\"#ccc\" font-size=\"24\">Row 4</text>\n  <line x1=\"150\" y1=\"100\" x2=\"150\" y2=\"400\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <line x1=\"300\" y1=\"100\" x2=\"300\" y2=\"400\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <line x1=\"450\" y1=\"100\" x2=\"450\" y2=\"400\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <line x1=\"600\" y1=\"100\" x2=\"600\" y2=\"400\" stroke=\"#ccc\" stroke-width=\"1\"/>\n  <text x=\"170\" y=\"130\" fill=\"#ccc\" font-size=\"24\">Column 1</text>\n  <text x=\"325\" y=\"130\" fill=\"#ccc\" font-size=\"24\">Column 2</text>\n  <text x=\"470\" y=\"130\" fill=\"#ccc\" font-size=\"24\">Column 3</text>\n  <text x=\"620\" y=\"130\" fill=\"#ccc\" font-size=\"24\">Column 4</text>\n    </g>\n   <!-- Table Footer -->\n<rect x=\"50\" y=\"500\" width=\"700\" height=\"100\" fill=\"#333\" stroke=\"#fff\" stroke-dasharray=\"5\" stroke-width=\"2\" rx=\"10\" />\n<text x=\"400\" y=\"550\" fill=\"#fff\" font-size=\"36\" text-anchor=\"middle\" alignment-baseline=\"middle\"> Table Footer</text>\n</svg>"
//   },