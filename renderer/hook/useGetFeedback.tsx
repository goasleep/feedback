import React, { useState } from "react";

import { ipcRenderer } from "electron";
import _ from "lodash";

export const useGetFeedback = (key) => {
  const [feedback, setFeedback] = useState(null);

  React.useEffect(() => {
    const getData = async () => {
      console.log(key);
      const data = await ipcRenderer.invoke("getFeedback", key);
      setFeedback(data);
      console.log(data);
    };
    getData();
  }, [key]);

  return feedback;
};

export const useGetFeedbackKeys = () => {
  const [feedback, setFeedback] = useState(null);

  React.useEffect(() => {
    const getData = async () => {
      const data = await ipcRenderer.invoke("getAllName");
      const options = data.map((item) => ({ value: item, label: item }));
      setFeedback(options);
    };
    getData();
  }, []);

  return feedback;
};
