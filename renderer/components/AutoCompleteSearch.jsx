import React, { useState } from "react";
import { AutoComplete } from "antd";
import lo from "lodash";
import { ipcRenderer } from "electron";

export default ({ value, onChange, component, searchKey }) => {
  const [options, setOptions] = useState([]);

  const onSearch = async (value) => {
    const option_ = await ipcRenderer.invoke(searchKey, value);
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
