import React from "react";
import { CssBaseline, Box, Button, Card } from "@material-ui/core";
import { ExchangePage } from "./ExchangePage";
import { SetupCurrencies } from "./SetupCurrencies";
import { SetupExhangeRates } from "./SetupExchangeRates";
import { DBContext, CreateOrGetDefaultDatabase } from "./data/DB";

type Page = "exchange" | "setup-currencies" | "setup-exhange-rates";

function App() {
  const [page, setPage] = React.useState<Page>("exchange");
  const db = React.useMemo(() => CreateOrGetDefaultDatabase(), []);
  return (
    <DBContext.Provider value={db}>
      <CssBaseline />
      <Box
        display={"flex"}
        flexDirection={"column"}
        paddingTop={3}
        alignItems={"center"}
      >
        <Box display={"flex"} flexDirection={"row"}>
          <Button
            variant={page === "setup-currencies" ? "outlined" : "text"}
            onClick={() => setPage("setup-currencies")}
          >
            {"Setup Currencies"}
          </Button>
          <Button
            variant={page === "exchange" ? "outlined" : "text"}
            onClick={() => setPage("exchange")}
          >
            {"Exchange"}
          </Button>
          <Button
            variant={page === "setup-exhange-rates" ? "outlined" : "text"}
            onClick={() => setPage("setup-exhange-rates")}
          >
            {"Setup Exchange Rates"}
          </Button>
        </Box>
        <Box marginTop={5} flex={1} minWidth={"75%"}>
          <Card>
            {page === "exchange" && <ExchangePage />}
            {page === "setup-currencies" && <SetupCurrencies />}
            {page === "setup-exhange-rates" && <SetupExhangeRates />}
          </Card>
        </Box>
      </Box>
    </DBContext.Provider>
  );
}

export default App;
