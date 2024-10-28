export const getNodeCaption = (node: any) => {
    if (node.properties?.name) {
      return node.properties.name;
    }
    if (node.properties?.title) {
      return node.properties.title;
    }
    if (node.properties?.type) {
      return node.properties.type;
    }
    if (node.properties?.act_type_id) {
      return node.properties.act_type_id;
    }
    if (node.properties?.block_id) {
      return node.properties.block_id;
    }
    if (node.properties?.crm_account_dim_id) {
      return node.properties.crm_account_dim_id;
    }
    return node.properties.id;
  };