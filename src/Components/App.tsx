import React from "react";
import { CssBaseline, Box, Card, AppBar, Tab, Tabs } from "@material-ui/core";
import { ExchangePage } from "./Pages/ExchangePage";
import { SetupCurrencies } from "./Pages/SetupCurrencies";
import { SetupExchangeRates } from "./Pages/SetupExchangeRates";
import { PLSDBContext, CreateOrGetDefaultPLSDatabase } from "../data/PLSDB";
import { SystemsPage } from "./Pages/Systems/SystemsPage";
import { getOrAskUser } from "../Utils";
import {
  CreateOrGetDefaultSystemsDatabase,
  SystemsDBContext,
} from "../data/SystemsDB";
const firebase = (window as any).firebase;

function App() {
  const [page, setPage] = React.useState(3);
  const plsDb = React.useMemo(() => CreateOrGetDefaultPLSDatabase(), []);
  const systemsDb = React.useMemo(
    () => CreateOrGetDefaultSystemsDatabase(),
    []
  );
  React.useEffect(() => {
    const username = getOrAskUser("username");
    const password = getOrAskUser("password");
    console.log(plsDb);
    console.log(systemsDb);
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then((r) => {
        plsDb.loadFromFirebase(r.user.uid);
        systemsDb.loadFromFirebase(r.user.uid);
      })
      .catch((e) => {
        alert(e.message);
        window.location.reload();
      });
  }, [plsDb, systemsDb]);
  return (
    <PLSDBContext.Provider value={plsDb}>
      <SystemsDBContext.Provider value={systemsDb}>
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
      </SystemsDBContext.Provider>
    </PLSDBContext.Provider>
  );
}

export default App;
