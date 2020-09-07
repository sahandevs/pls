import React from "react";
import { CssBaseline, Box, Card, AppBar, Tab, Tabs } from "@material-ui/core";
import { ExchangePage } from "./Pages/ExchangePage";
import { SetupCurrencies } from "./Pages/SetupCurrencies";
import { SetupExchangeRates } from "./Pages/SetupExchangeRates";
import { PLSDBContext, CreateOrGetDefaultDatabase } from "../data/PLSDB";
import { SystemsPage } from "./Pages/Systems/SystemsPage";

function App() {
  const [page, setPage] = React.useState(3);
  const db = React.useMemo(() => CreateOrGetDefaultDatabase(), []);
  return (
    <PLSDBContext.Provider value={db.pls}>
      <CssBaseline />
      <AppBar position="static">
        <Tabs value={page} onChange={(_, x) => setPage(x)} centered>
          <Tab label="Setup Currencies" />
          <Tab label="Exchange" />
          <Tab label="Setup Exchange Rates" />
          <Tab label="Systems" />
        </Tabs>
      </AppBar>
      {page === 3 && <SystemsPage />}
      {page !== 3 && (
        <Box marginTop={5} flex={1} minWidth={"75%"}>
          <Card>
            {page === 0 && <SetupCurrencies />}
            {page === 1 && <ExchangePage />}
            {page === 2 && <SetupExchangeRates />}
          </Card>
        </Box>
      )}
    </PLSDBContext.Provider>
  );
}

export default App;
