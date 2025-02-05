import { useState } from "react";
import MembersTable from "./components/membersTable";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import ProductTable from "../admin/components/productsContainer";
import OrdersTab from "../admin/components/ordersTab";
import "../../styles/ManagerPage.css"; // External CSS for styling

// Custom TabPanel component
function TabPanel(props: {
  value: string;
  index: string;
  children: React.ReactNode;
}) {
  const { value, index, children } = props;
  return value === index ? <Box className="tab-panel">{children}</Box> : null;
}

export default function ManagerPage() {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box className="manager-container">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="manager tabs"
        className="tabs-container"
      >
        <Tab label="My Team" value="1" className="tab-item" />
        <Tab label="My Team Orders" value="2" className="tab-item" />
        <Tab label="Products" value="3" className="tab-item" />
      </Tabs>

      <TabPanel value={value} index="1">
        <MembersTable />
      </TabPanel>
      <TabPanel value={value} index="2">
        <OrdersTab />
      </TabPanel>
      <TabPanel value={value} index="3">
        <ProductTable />
      </TabPanel>
    </Box>
  );
}
