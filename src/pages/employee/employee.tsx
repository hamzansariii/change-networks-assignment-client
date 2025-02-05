import { useState } from "react";
import "../../styles/EmployeePage.css"; // External CSS for styling
import ProductsContainer from "./components/productsContainer";
import YourOrdersContainer from "./components/yourOrdersContainer";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

function TabPanel(props: {
  value: string;
  index: string;
  children: React.ReactNode;
}) {
  const { value, index, children } = props;
  return value === index ? <Box className="tab-panel">{children}</Box> : null;
}

export default function EmployeePage() {
  const [value, setValue] = useState("1");

  const handleChange = (newValue: any) => {
    setValue(String(newValue)); // Ensuring it's a string for type safety
  };

  return (
    <Box className="employee-container">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="employee tabs"
        className="tabs-container"
      >
        <Tab label="Explore Products" value="1" className="tab-item" />
        <Tab label="My Orders" value="2" className="tab-item" />
      </Tabs>

      <TabPanel value={value} index="1">
        <ProductsContainer />
      </TabPanel>
      <TabPanel value={value} index="2">
        <YourOrdersContainer />
      </TabPanel>
    </Box>
  );
}
