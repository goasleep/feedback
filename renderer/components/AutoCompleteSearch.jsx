import React, { useState } from "react";
import { AutoComplete } from "antd";
import lo from "lodash";
import { ipcRenderer } from "electron";

export default ({ value, onChange, component, searchKey, form, meta }) => {
  const [options, setOptions] = useState([]);

  const onSearch = async (value) => {
    let option_ = [];
    if (searchKey === "searchKnowledgeDesc") {
      const title = form.getFieldValue(meta.name[0])[meta.index].title;
      option_ = await ipcRenderer.invoke(searchKey, { keyword: value, title });
    } else {
      option_ = await ipcRenderer.invoke(searchKey, value, form);
    }
    console.log(option_);
    setOptions(option_);
  };

  return (
    <AutoComplete
      options={options}
      value={value}
      onChange={onChange}
      onSelect={onChange}
      onSearch={lo.debounce(onSearch, 500)}
    >
      {component}
    </AutoComplete>
  );
};
