import { useState } from "react";
import UserTable from "./components/userTable";
import "../../styles/AdminPage.css"; // External CSS for styling
import AdminProductsContainer from "./components/productsContainer";
import OrdersTab from "./components/ordersTab";

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

export default function AdminPage() {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box className="admin-container">
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="admin tabs"
        className="tabs-container"
      >
        <Tab label="Team" value="1" className="tab-item" />
        <Tab label="Products" value="2" className="tab-item" />
        <Tab label="All Orders" value="3" className="tab-item" />
      </Tabs>

      <TabPanel value={value} index="1">
        <UserTable />
      </TabPanel>
      <TabPanel value={value} index="2">
        <AdminProductsContainer />
      </TabPanel>
      <TabPanel value={value} index="3">
        <OrdersTab />
      </TabPanel>
    </Box>
  );
}
