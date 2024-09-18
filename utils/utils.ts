export const getNodeCaption = (node: any) => {
    if (node.properties?.name) {
      return node.properties.name;
    }
    if (node.properties?.title) {
      return node.properties.title;
    }
    return node.properties.id;
  };