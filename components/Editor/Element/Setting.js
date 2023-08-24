import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Popover } from 'antd';

const Setting = ({ children, node, onUpdate }) => {
  const [nodeName, setNodeName] = useState('');
  const [idValue, setIdValue] = useState('');
  const [hrefValue, setHrefValue] = useState('');
  const [srcValue, setSrcValue] = useState('');
  const [className, setClassName] = useState('');

  useEffect(() => {
    setNodeName(node.name || '');
    setIdValue(node.attributes?.id?.value || '');
    setHrefValue(node.attributes?.href?.value || '');
    setSrcValue(node.attributes?.src?.value || '');

    if (!Array.isArray(node.classes))
      node.classes = []

    const findIndex = node.classes.findIndex(cls => cls.main === true);
    if (findIndex !== -1)
      setClassName(node.classes[findIndex]?.name);
      else
      setClassName('');


  }, [node])

  const handleNameChange = (e) => {
    setNodeName(e.target.value);
  };

  const handleIdChange = (e) => {
    setIdValue(e.target.value);
  };

  const handleHrefChange = (e) => {
    setHrefValue(e.target.value);
  };

  const handleSrcChange = (e) => {
    setSrcValue(e.target.value);
  };

  const handleClassChange = (e) => {

    if (Array.isArray(node.classes))
      node.classes = []

    node.classes = node.classes
    setClassName(e.target.value);

  };

  const handleSave = () => {
    node.name = nodeName;

    if (idValue) {
      node.attributes = {
        ...node.attributes,
        id: { key: 'id', value: idValue },
      };
    } else if (node.attributes?.id) {
      delete node.attributes.id;
    }

    if (hrefValue) {
      node.attributes = {
        ...node.attributes,
        href: { key: 'href', value: hrefValue },
      };
    } else if (node.attributes?.href) {
      delete node.attributes.href;
    }

    if (srcValue) {
      node.attributes = {
        ...node.attributes,
        src: { key: 'src', value: srcValue },
      };
    } else if (node.attributes?.src) {
      delete node.attributes.src;
    }

    if (!Array.isArray(node.classes))
      node.classes = []

    if (className) {
      node.classes = [...node.classes, { name: className, main: true }]
    } else {
      const findIndex = node.classes.findIndex(cls => cls.main === true);
      if (findIndex !== -1)
        delete node.classes[findIndex];
    }




    onUpdate();
  };

  const content = (
    <Form layout="vertical">
      <Form.Item label="Name" className="font-500">
        <Input
          placeholder="Element Name"
          value={nodeName}
          onChange={handleNameChange}
        />
      </Form.Item>
      <Form.Item label="Element ID">
        <Input
          value={idValue}
          placeholder="ID"
          onChange={handleIdChange}
        />
      </Form.Item>
      {node.tagName === 'a' && (
        <Form.Item label="Custom Link">
          <Input
            value={hrefValue}
            placeholder="href"
            onChange={handleHrefChange}
          />
        </Form.Item>
      )}
      {(node.tagName === 'img' || node.tagName === 'video') && (
        <Form.Item label="Custom src">
          <Input
            value={srcValue}
            placeholder="src"
            onChange={handleSrcChange}
          />
        </Form.Item>
      )}
      <Form.Item label="Main Class" className="font-500">
        <Input
          placeholder="Class Name"
          value={className}
          onChange={handleClassChange}
        />
      </Form.Item>
      <Button type="primary" size="small" onClick={handleSave}>
        Save
      </Button>
    </Form>
  );

  return (
    <Popover content={content} title="Setting" trigger="click">
      {children}
    </Popover>
  );
};

export default Setting;