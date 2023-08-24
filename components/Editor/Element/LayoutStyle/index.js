import React, { useState } from 'react';
import Container from './Container';
import Menu from './Menu';

import Text from './Text';
import Icon from './Icon';

import Link from "./Link";
import List from './List';
import Header from './Header';
import Nav from './Nav';
import Aside from './Aside';
import Main from './Main';
import Section from './Section';
import Div from './Div';
import Article  from './Article';
import Hr  from './HR';
import Footer  from './Footer';
import Image from './Image';
import Video from './Video';
import Audio from './Audio';
import Inputs from './Input';
import Buttons from './Button';
import Selects from './Select';
import FileInput from './FileInput';
import RadioCheckbox from './RadioCheckbox';
import Sliders from './Slider';
import Flex from './Flex';
import Grid from './Grid';
import Slides from './Slides';
import Slide from './Slide';
import Tabs from './Tabs';
import TabsContent from './TabsContent';
import TabContent from './TabContent';
import TabsButton from './TabsButton';
import Accordions from './Accordions';
import Accordion from './Accordion';
import Gallery from './Gallery';
import Modal from './Modal';
import Sider from './Sider';
import Dropdowns from './Dropdown';
import GoToTop from './GoToTop';
import SvgIcon from './SvgIcon';

function LayoutStyle({ children, layout, selector }) {
  const Component =
    layout === 'container' ? (
      <Container style={selector?.style} properties={selector?.properties || {}}>{children}</Container>
    ) : layout === 'menu' ? (
      <Menu style={selector?.style} properties={selector?.properties || {}}>{children}</Menu>
    ) :  layout === 'slider' ? (
      <Sliders style={selector?.style} properties={selector?.properties || {}}>{children}</Sliders>
    ) :  layout === 'slides' ? (
      <Slides style={selector?.style} properties={selector?.properties || {}}>{children}</Slides>
    ) :  layout === 'slide' ? (
      <Slide style={selector?.style} properties={selector?.properties || {}}>{children}</Slide>
    ) :  layout === 'tabs' ? (
      <Tabs style={selector?.style} properties={selector?.properties || {}}>{children}</Tabs>
    ) :  layout === 'tabs-content' ? (
      <TabsContent style={selector?.style} properties={selector?.properties || {}}>{children}</TabsContent>
    ) :  layout === 'tab-content' ? (
      <TabContent style={selector?.style} properties={selector?.properties || {}}>{children}</TabContent>
    ) :  layout === 'tabs-btn' ? (
      <TabsButton style={selector?.style} properties={selector?.properties || {}}>{children}</TabsButton>
    ) :  layout === 'accordions' ? (
      <Accordions style={selector?.style} properties={selector?.properties || {}}>{children}</Accordions>
    ) :  layout === 'accordion' ? (
      <Accordion style={selector?.style} properties={selector?.properties || {}}>{children}</Accordion>
    )  :  layout === 'gallery' ? (
      <Gallery style={selector?.style} properties={selector?.properties || {}}>{children}</Gallery>
    )  :  layout === 'sider' ? (
      <Sider style={selector?.style} properties={selector?.properties || {}}>{children}</Sider>
    ) :  layout === 'modal' ? (
      <Modal style={selector?.style} properties={selector?.properties || {}}>{children}</Modal>
    ) :  layout === 'dropdown' ? (
      <Dropdowns style={selector?.style} properties={selector?.properties || {}}>{children}</Dropdowns>
    ) :  layout === 'gototop' ? (
      <GoToTop style={selector?.style} properties={selector?.properties || {}}>{children}</GoToTop>
    ) :  layout === 'flex' ? (
      <Flex style={selector?.style} properties={selector?.properties || {}}>{children}</Flex>
    ) : layout === 'grid' ? (
      <Grid style={selector?.style} properties={selector?.properties || {}}>{children}</Grid>
    ) : layout === 'text' ? (
        <Text style={selector?.style} properties={selector?.properties || {}}>{children}</Text>
      ) : layout === 'icon' ? (
        <Icon style={selector?.style} properties={selector?.properties || {}}>{children}</Icon>
      ) :layout === 'svg-icon' ? (
        <SvgIcon style={selector?.style} properties={selector?.properties || {}}>{children}</SvgIcon>
      ): layout === 'link' ? (
        <Link style={selector?.style} properties={selector?.properties || {}}>{children}</Link>
      ) : layout === 'list' ? (
        <List style={selector?.style} properties={selector?.properties || {}}>{children}</List>
      ) : layout === 'header' ? (
        <Header style={selector?.style} properties={selector?.properties || {}}>{children}</Header>
      ) : layout === 'nav' ? (
        <Nav style={selector?.style} properties={selector?.properties || {}}>{children}</Nav>
      ) :  layout === 'aside' ? (
        <Aside style={selector?.style} properties={selector?.properties || {}}>{children}</Aside>
      ) : layout === 'main' ? (
        <Main style={selector?.style} properties={selector?.properties || {}}>{children}</Main>
      ) : layout === 'section' ? (
        <Section style={selector?.style} properties={selector?.properties || {}}>{children}</Section>
      ) : layout === 'div' ? (
        <Div style={selector?.style} properties={selector?.properties || {}}>{children}</Div>
      ) :  layout === 'article' ? (
        <Article style={selector?.style} properties={selector?.properties || {}}>{children}</Article>
      ) :  layout === 'hr' ? (
        <Hr style={selector?.style} properties={selector?.properties || {}}>{children}</Hr>
      ) :  layout === 'footer' ? (
        <Footer style={selector?.style} properties={selector?.properties || {}}>{children}</Footer>
      ) :  layout === 'img' ? (
        <Image style={selector?.style} properties={selector?.properties || {}}>{children}</Image>
      ) :  layout === 'video' ? (
        <Video style={selector?.style} properties={selector?.properties || {}}>{children}</Video>
      ) :  layout === 'audio' ? (
        <Audio style={selector?.style} properties={selector?.properties || {}}>{children}</Audio>
      ) :  layout === 'input' ? (
        <Inputs style={selector?.style} properties={selector?.properties || {}}>{children}</Inputs>
      ) :  layout === 'inputgroup' ? (
        <RadioCheckbox style={selector?.style} properties={selector?.properties || {}}>{children}</RadioCheckbox>
      ) :  layout === 'fileinput' ? (
        <FileInput style={selector?.style} properties={selector?.properties || {}}>{children}</FileInput>
      ) :  layout === 'select' ? (
        <Selects style={selector?.style} properties={selector?.properties || {}}>{children}</Selects>
      ) :  layout === 'submit' ||  layout === 'button' ? (
        <Buttons style={selector?.style} properties={selector?.properties || {}}>{children}</Buttons>
      ) :  (
      <></>
    );

  return <>{Component}</>;
}

export default LayoutStyle;