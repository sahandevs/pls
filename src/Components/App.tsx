import React from "react";
import {
  CssBaseline,
  Box,
  Card,
  AppBar,
  Tab,
  Tabs,
} from "@material-ui/core";
import { ExchangePage } from "./Pages/ExchangePage";
import { SetupCurrencies } from "./Pages/SetupCurrencies";
import { SetupExchangeRates } from "./Pages/SetupExchangeRates";
import { DBContext, CreateOrGetDefaultDatabase } from "../data/DB";

function App() {
  const [page, setPage] = React.useState(1);
  const db = React.useMemo(() => CreateOrGetDefaultDatabase(), []);
  return (
    <DBContext.Provider value={db}>
      <CssBaseline />
      <AppBar position="static">
        <Tabs
          value={page}
          onChange={(_, x) => setPage(x)}
          centered
        >
          <Tab label="Setup Currencies" />
          <Tab label="Exchange" />
          <Tab label="Setup Exchange Rates" />
        </Tabs>
      </AppBar>

      <Box marginTop={5} flex={1} minWidth={"75%"}>
        <Card>
          {page === 0 && <SetupCurrencies />}
          {page === 1 && <ExchangePage />}
          {page === 2 && <SetupExchangeRates />}
        </Card>
      </Box>
    </DBContext.Provider>
  );
}

export default App;
