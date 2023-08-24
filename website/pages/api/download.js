import {
    findAllPages,
    findComponentById,
    findColelctionById,
    findDocumentsWithKey,
    findDocumentWithRelation, findFormById, findLayoutById
} from '@/api-helper/database';

import { authorizeAPI, database, cors } from '@/api-helper/middlewares';
import { ncOpts } from '@/api-helper/nc';
import nc from 'next-connect';
const handler = nc(ncOpts);
const JSZip = require("jszip");

import theme from './data/theme.json';
import setting from './data/setting.json';


handler.use(database);


const getValue = (elem, value = '', states, props) => {
    const type = elem.type;
    const key = elem.key;

    switch (type) {
        case 'STATES':
            return getStateValue(key, states);
        case 'PROPS':
            return getStateValue(key, props);
        default:
            return value;
    }

}

import { generateCss, getStateValue, getCurrentDate, generateAnimations } from "@/lib/utils"

const rootCss = `body {${theme.colors.map(color => {
    return color.value + ':' + color.color + ";"
})}}`


const styles = theme.styles ? theme.styles : {};
const customCss = generateCss(styles);
const animations = theme.animations ? theme.animations : {};

const customAnmations = generateAnimations(animations);

const jsCode = theme.themeJs ? theme.themeJs.code : '';
const cssCode = theme.themeCss ? theme.themeCss.code : '';

const fs = require('fs');
const path = require('path');

import Page from "@/components/Page";
import { renderToString } from 'react-dom/server';

const htmldoc = (htmlText, css, pageSetting, scripts) => `
<!DOCTYPE html>
<html>
<head>
<meta name="title" content=${pageSetting?.title || setting.webtitle} />
<meta name="description" content=${pageSetting?.desc || setting.desc} />
<title>${pageSetting?.title || setting.webtitle} - ${setting.tagLine}</title>
<meta name="author" content=${setting.author} />
<meta name="keywords" content=${setting.keywords} />
<link rel="icon" href=${setting.images?.favicon?.src} />
<meta httpEquiv="Content-Language" content=${setting.lang} />
${setting.pageSetting?.head || ''}
${scripts?.head || ''}
<link rel="stylesheet" href="../static/style.css">
<style>${css}</style>
</head>
<body>
${htmlText}
${setting.pageSetting?.footer || ''}
${scripts?.footer || ''}
<link rel="stylesheet" href="../static/index.js">
</body>
</html>
`

const generatePage = async (db, page) => {
    let elements = {};
    let css = '';
    let styles = {}
    let pages = {}

    let topLayout = { pages: {}, _id: '' }
    let bottomLayout = { pages: {}, id: '' }

    if (page) {

        const layout = await findLayoutById(db, page.layout?._id)

        if (layout) {
            const components = layout.components;
            topLayout._id = components.top?._id;
            bottomLayout._id = components.bottom?._id;

            if (topLayout._id)
                await loadCompoents([topLayout._id], topLayout.pages)
            if (bottomLayout._id)
                await loadCompoents([bottomLayout._id], bottomLayout.pages)
        }

        elements = page.elements ? page.elements : {};

        pages[page._id] = { elements, states: page.states };

        const components = page.components;
        const forms = page.forms;

        const getFilters = (colStates, states, props) => {

            let _filters = [];

            if (!colStates.filters)
                return _filters;

            _filters = Object.values(colStates.filters).map(filter => {

                const type = filter.triggerType;
                const key = filter.triggerKey;
                const value = filter.defaultValue;

                let defaultValue = getValue({ type, key }, value, states, props);
                return { filterKey: filter.filterKey, defaultValue }
            }
            )

            return _filters;

        }

        const laodDocumnents = async (collection, relationships, _states, _props) => {

            let limit = collection.limit;
            let page = collection.page;
            const docs = collection.docs;
            const states = collection.states;

            let documents = [];
            let maxPage = collection.maxPage || 0;

            if (Array.isArray(docs) && docs?.length > 0) {

                const docIds = docs.map(doc => doc._id);



                const res = await findDocumentWithRelation(
                    req.db,
                    docIds,
                    collection.slug,
                    relationships || []
                );

                documents = Array.isArray(res.documents) ? res.documents : [];
                maxPage = res.total;

            }
            else {

                const filters = getFilters(states, _states, _props);

                const res = await findDocumentsWithKey(
                    req.db,
                    collection.slug,
                    '',
                    relationships,
                    page,
                    limit,
                    Array.isArray(filters) ? filters : [],
                );

                documents = Array.isArray(res.documents) ? res.documents : [];
                maxPage = res.total;


            }

            return { ...collection, documents, states, maxPage }

        }
        const loadCompoents = async (components, pages) => {
            for (const component of components) {

                if (component === topLayout._id) {
                    pages[component] = topLayout.pages[component]
                }
                else
                    if (component === bottomLayout._id) {
                        pages[component] = bottomLayout.pages[component]

                    }
                    else {

                        const comp = await findComponentById(db, component);
                        let colStates = {};
                        if (comp) {
                            elements = comp.elements ? comp.elements : {};

                            styles = comp.styles ? comp.styles : {};
                            css += generateCss(styles);

                            if (comp.collection) {

                                const collection = component.collection;
                                const coll = await findColelctionById(db, collection._id);

                                let relationships = undefined;
                                const selectedRelationships = collection.selectedRelationships;
                                const withRelationship = collection.withRelationship;


                                if (withRelationship && Array.isArray(selectedRelationships) && Array.isArray(coll.relationships)) {
                                    relationships = coll.relationships.filter(relation => selectedRelationships.some(selected => relation._id == selected._id))
                                }

                                const parent = await findComponentById(db, comp.parent);

                                colStates = await laodDocumnents(collection, relationships, comp.states, parent.states);

                            }

                            pages[component] = { elements, colStates: colStates, states: comp.states };

                            const innerComponents = comp.components;

                            await loadCompoents(innerComponents)
                        }
                    }
            }
        }


        const loadForms = async (forms) => {
            for (const form of forms) {

                const fm = await findFormById(db, form);

                if (fm) {
                    elements = fm.elements ? fm.elements : {};
                    pages[form] = { formStates: fm.formStates, elements };

                    styles = fm.styles ? fm.styles : {};
                    css += generateCss(styles);

                    const components = fm.components;

                    await loadCompoents(components)
                }
            }
        }

        loadCompoents(components);
        loadForms(forms);

        styles = page.styles ? page.styles : {};


        css = generateCss(styles);

    }


    return {
        topLayout,
        bottomLayout,
        pages,
        css,
        pageSetting: page?.setting
    }
}

const generatePages = async (db, _pages, pagesFolder) => {



    for (const page of _pages) {

        const { topLayout, bottomLayout,
            pages,
            css,
            pageSetting } = await generatePage(db, page);


        const header = renderToString(<Page pages={topLayout.pages} _id={topLayout._id}
            setting={{ ...pageSetting, global: { ...setting } }}
        />);
        const body = renderToString(<Page pages={pages} _id={page._id}
            setting={{ ...pageSetting, global: { ...setting } }}
        />);
        const footer = renderToString(<Page pages={bottomLayout.pages} _id={bottomLayout._id}
            setting={{ ...pageSetting, global: { ...setting } }}
        />);
        const html = header + body + footer;

        pagesFolder.file((page.name) + '.html', htmldoc(html, css, pageSetting, page.scripts));

    }
}

handler.get(async (req, res) => {


    const { name, isPage, isComponent, isForm, isCollection, isPublic, projectId } = req.query;


    if (!projectId || projectId !== setting._id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const zip = new JSZip();
        const pagesFolder = zip.folder("pages");
        const compsFolder = zip.folder("components");
        const formsFolder = zip.folder("forms");
        const collsFolder = zip.folder("collections");
        const staticFolder = zip.folder("static");
        const rootFolder = zip.folder("");
        const assetsFolder = rootFolder.folder("public");


        if (Boolean(isPage == 'true')) {
            const res = await findAllPages(req.db, 'pages');

            await generatePages(req.db, res.pages, pagesFolder);

        }

        if (Boolean(isComponent == 'true')) {
            const res = await findAllPages(req.db, 'components');
            console.log(res)

            await generatePages(req.db, res.pages, compsFolder);
        }

        if (Boolean(isForm == 'true')) {
            const res = await findAllPages(req.db, 'forms');
            console.log(res)
            await generatePages(req.db, res.pages, formsFolder);
        }

        if (Boolean(isCollection == 'true')) {
            const res = await findAllPages(req.db, 'collections');
            await generatePages(req.db, res.pages, collsFolder);
        }


        staticFolder.file('style.css', rootCss + cssCode + customCss + customAnmations);
        staticFolder.file('index.js', jsCode);

        if (isPublic) {
            var destinationDir = path.join('', "./public");

            const addFilesToZip = (folderPath, folderName) => {
                const files = fs.readdirSync(folderPath);

                files.forEach((file) => {
                    const filePath = path.join(folderPath, file);
                    const stats = fs.statSync(filePath);

                    if (stats.isFile()) {
                        const fileContent = fs.readFileSync(filePath);
                        assetsFolder.file(path.join(folderName, file), fileContent);
                    } else if (stats.isDirectory()) {
                        const subFolderPath = path.join(folderPath, file);
                        const subFolderName = path.join(folderName, file);
                        addFilesToZip(subFolderPath, subFolderName);
                    }
                });
            };

            addFilesToZip(destinationDir, "");
        }


        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${name || setting.webtitle || 'theme'}-${getCurrentDate()}.zip`);

        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(res)
            .on('finish', () => {
                res.end();
            });

    } catch (e) {
        console.log(e?.message)
        res
            .status(403)
            .json({ error: { message: 'Something went wrong.' } });
        return;
    }
});





export default handler;