import { fetcher } from "@/lib/fetch";
import { database } from '@/api-helper/middlewares';

import nc from 'next-connect';
import {
  findComponentById,
  findColelctionById,
  findDocumentsWithKey,
  findDocumentWithRelation,
  findFormById,
  findPageById,
  findLayoutById
} from '@/api-helper/database';



import theme from './api/data/theme.json';
import setting from './api/data/setting.json';
import React from 'react';

import AutoCode from 'autocode'; 


import Page from "@/components/Page";
import { v4 as uuid } from 'uuid';
import Head from "next/head";
import parser from 'html-react-parser';
import Script from "next/script";

import { generateCss, getStateValue, generateAnimations } from "@/lib/utils"
import { useEffect, useState } from "react";

const rootCss = `body {${theme.colors.reduce((cssString, color) => {
  return cssString + color.value + ':' + color.color + ";";
}, '')}}`;


const styles = theme.styles ? theme.styles : {};
const customCss = generateCss(styles);
const animations = theme.animations ? theme.animations : {};

const customAnmations = generateAnimations(animations);

const jsCode = theme.themeJs ? theme.themeJs.code : '';
const cssCode = theme.themeCss ? theme.themeCss.code : '';



export default function DynamicPage({
  topLayout,
  bottomLayout,
  pageSetting,
  websiteSetting,
  _id,
  pages,
  css,
  js
}) {

  const topLayoutParsed = JSON.parse(topLayout);
  const bottomLayoutParsed = JSON.parse(bottomLayout);
  const pageParsed = JSON.parse(pages);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return <><Head>

    <title>{
      pageSetting.title ?
        pageSetting.title :
        websiteSetting.webtitle ?
          websiteSetting.webtitle : 'Page'}</title>
    <meta name="description" content={
      pageSetting.desc ?
        pageSetting.desc :
        websiteSetting.desc ?
          websiteSetting.desc :
          'Page Description'} />

    <meta name="author" content={websiteSetting.author} />
    <meta name="keywords" content={websiteSetting.keywords} />
    <link rel="icon" href={websiteSetting.images?.favicon?.src} />
    <meta httpEquiv="Content-Language" content={websiteSetting.lang} />


    <style>
      {css}
    </style>


    <> {parser(websiteSetting.scripts?.head || '')}
      {parser(pageSetting.scripts?.head || '')}
    </>
  </Head>



    <AutoCode pages={topLayoutParsed.pages} _id={topLayoutParsed._id}
      setting={{ ...pageSetting, global: { ...setting } }}
    />
    <AutoCode pages={pageParsed} _id={_id}
      setting={{ ...pageSetting, global: { ...setting } }}
    />
    <AutoCode pages={bottomLayoutParsed.pages} _id={bottomLayoutParsed._id}
      setting={{ ...pageSetting, global: { ...setting } }} />

    <script>

    </script>

    {websiteSetting.scripts?.foot}
    {pageSetting.scripts?.foot}
  </>
}

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

export async function getServerSideProps(context) {


  await nc().use(database).run(context.req, context.res);


  let page = null;

  if (setting.maintenancePage) {
    page = await findPageById(context.req.db, setting.maintenancePage._id)
  }
  else {
    if (setting.homePage) {
      page = await findPageById(context.req.db, setting.homePage._id);

      if (!page?.setting.status)
        page = null;
    }
  }

  if (!page) {
    if (setting.errorPage)
      page = await findPageById(context.req.db, setting.errorPage._id)
  }

  if (!page)
  return {
      notFound: true,
  }

  let elements = {};
  let css = rootCss + cssCode + customCss + customAnmations;
  let js = jsCode;
  let websiteSetting = {
    webtitle: setting.webtitle,
    scripts: setting.scripts,
    desc: setting.desc,
    images: setting.images,
    lang: setting.lang
  }


  let styles = {}
  let pages = {}

  let topLayout = { pages: {}, _id: '' }
  let bottomLayout = { pages: {}, id: '' }

  if (page) {

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

            const comp = await findComponentById(context.req.db, component);
            let colStates = {};
            if (comp) {
              elements = comp.elements ? comp.elements : {};

              styles = comp.styles ? comp.styles : {};
              css += generateCss(styles);

              if (comp.collection?._id) {

                const collection = comp.collection;
                const coll = await findColelctionById(context.req.db, collection._id);

                let relationships = undefined;
                const selectedRelationships = collection.selectedRelationships;
                const withRelationship = collection.withRelationship;


                if (withRelationship && Array.isArray(selectedRelationships) && Array.isArray(coll.relationships)) {
                  relationships = coll.relationships.filter(relation => selectedRelationships.some(selected => relation._id == selected._id))
                }

                const parent = await findComponentById(context.req.db, comp.parent);

                colStates = await laodDocumnents(collection, relationships, comp.states, parent.states);

              }

              pages[component] = { elements, colStates: colStates, states: comp.states };

              const innerComponents = comp.components;

              await loadCompoents(innerComponents, pages)
            }
          }
      }
    }

    const loadForms = async (forms) => {
      for (const form of forms) {

        const fm = await findFormById(context.req.db, form);

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


    const layout = await findLayoutById(context.req.db, page.layout._id)

    if (layout) {
      const components = layout.components;
      if (layout.topComponent && components.top?._id) {
        console.log(topLayout)

        await loadCompoents([components.top?._id], topLayout.pages);
        topLayout._id = components.top._id;
      }
      if (layout.bottomComponent && components.bottom?._id) {

        await loadCompoents([components.bottom?._id], bottomLayout.pages);
        bottomLayout._id = components.bottom._id;

      }
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





    loadCompoents(components, pages);
    loadForms(forms);

    styles = page.styles ? page.styles : {};


    css += generateCss(styles);

  }

  const pageSetting = {
    name: page?.name,
    creator: page?.creator,
    ...(page?.setting || {}),
    global: websiteSetting,

  }

  return {
    props: {
      topLayout: JSON.stringify(topLayout, null, 4),
      bottomLayout: JSON.stringify(bottomLayout, null, 4),
      _id: page?._id ? page._id.toString() : null, // Convert _id to a string if it is defined, otherwise set it to null
      pages: JSON.stringify(pages, null, 4),
      websiteSetting,
      css,
      js,
      pageSetting,
    }
  };
}