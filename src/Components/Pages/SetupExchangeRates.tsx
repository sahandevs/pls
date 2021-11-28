import React from "react";
import { ExchangeRate, usePLSDBContext } from "../../data/PLSDB";
import { useObservable } from "../../Utils";
import {
  Box,
  Icon,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
} from "@material-ui/core";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";

function Item({ rate, isNew }: { rate?: ExchangeRate; isNew: boolean }) {
  const db = usePLSDBContext();
  const currencies = useObservable(db.getCurrencies(), []);
  const [from, setFrom] = React.useState(() => rate?.from);
  const [to, setTo] = React.useState(() => rate?.to);
  const [rateValue, setRateValue] = React.useState(
    () => rate?.rate.toString() ?? ""
  );
  const isSmallScreen = useIsSmallScreen();

  const isEdited =
    from !== rate?.from ||
    to !== rate?.to ||
    Number(rateValue) !== rate?.rate;
  const isValid =
    !isNaN(Number(rateValue)) &&
    from != null &&
    to != null &&
    Number(rateValue) > 0;

  const content = (
    <>
      <Box display={"flex"} flexDirection={"row"}>
        <FormControl>
          <InputLabel id="from-label-id">{"From"}</InputLabel>
          <Select
            labelId="from-label-id"
            value={db.getCurrency(from ?? "")?.id}
            onChange={(e: any, d: any) =>
              setFrom(currencies.find((x) => x.id === e.target.value)?.id)
            }
          >
            <MenuItem>{"-"}</MenuItem>
            {currencies
              .filter((x) => x.id !== to)
              .map((currency, i) => (
                <MenuItem key={currency.id + "_from"} value={currency.id}>
                  {currency.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <Box marginX={1} />
        <TextField
          value={rateValue}
          inputMode={"decimal"}
          onChange={(e) => setRateValue(e.target.value)}
          label={"Rate"}
        />
        <Box marginX={1} />
        <FormControl>
          <InputLabel id="to-label-id">{"To"}</InputLabel>
          <Select
            labelId="to-label-id"
            value={db.getCurrency(to ?? "")?.id}
            onChange={(e: any, d: any) =>
              setTo(currencies.find((x) => x.id === e.target.value)?.id)
            }
          >
            <MenuItem>{"-"}</MenuItem>
            {currencies
              .filter((x) => x.id !== from)
              .map((currency, i) => (
                <MenuItem key={currency.id + "_to"} value={currency.id}>
                  {currency.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      {isValid && (
        <Typography>{`1 ${db.getCurrency(from ?? "")?.unit} of ${db.getCurrency(from ?? "")?.name} = ${Number(rateValue)} ${
          db.getCurrency(to ?? "")?.unit
        } of ${db.getCurrency(to ?? "")?.name}`}</Typography>
      )}

      <Box display={"flex"} flexDirection={"row"}>
        {isEdited && isValid && (
          <Button
            onClick={() => {
              if (from == null || to == null) return;
              db.addOrUpdateExchangeRate({
                from: from,
                to: to,
                rate: Number(rateValue),
              });
            }}
          >
            <Icon>{"save"}</Icon>
          </Button>
        )}

        {!isNew && rate != null && (
          <Button
            onClick={() => {
              db.removeExchangeRate(rate);
            }}
          >
            <Icon>{"delete"}</Icon>
          </Button>
        )}
      </Box>
    </>
  );

  if (isSmallScreen)
    return (
      <Card style={{ margin: 10 }}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          margin={1}
        >
          {content}
        </Box>
      </Card>
    );

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      margin={1}
      justifyContent={"space-between"}
    >
      {content}
    </Box>
  );
}

export function SetupExchangeRates() {
  const db = usePLSDBContext();
  const rates = useObservable(db.getExchangeRates(), []);
  return (
    <Box display={"flex"} flexDirection={"column"}>
      {rates.map((rate, i) => (
        <Item
          key={rate.from + "_" + rate.to + "_" + rate.rate}
          rate={rate}
          isNew={false}
        />
      ))}
      <Item key={rates.length} isNew={true} />
    </Box>
  );
}
