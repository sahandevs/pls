import React from "react";
import { ExchangeRate, useDBContext } from "./data/DB";
import { useObservable } from "./Utils";
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
} from "@material-ui/core";

function Item({ rate, isNew }: { rate?: ExchangeRate; isNew: boolean }) {
  const db = useDBContext();
  const currencies = useObservable(db.getCurrencies(), []);
  const [from, setFrom] = React.useState(() => rate?.from);
  const [to, setTo] = React.useState(() => rate?.to);
  const [rateValue, setRateValue] = React.useState(
    () => rate?.rate.toString() ?? ""
  );

  const isEdited =
    from?.name !== rate?.from.name ||
    to?.name !== rate?.to.name ||
    Number(rateValue) !== rate?.rate;
  const isValid =
    !isNaN(Number(rateValue)) &&
    from != null &&
    to != null &&
    Number(rateValue) > 0;

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      margin={1}
      justifyContent={"space-between"}
    >
      <Box display={"flex"} flexDirection={"row"}>
        <FormControl>
          <InputLabel id="from-label-id">{"From"}</InputLabel>
          <Select
            labelId="from-label-id"
            value={from?.name}
            onChange={(e: any, d: any) =>
              setFrom(currencies.find((x) => x.name === e.target.value))
            }
          >
            <MenuItem>{"-"}</MenuItem>
            {currencies
              .filter((x) => x.name !== to?.name)
              .map((currency, i) => (
                <MenuItem key={currency.name + "_from"} value={currency.name}>
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
            value={to?.name}
            onChange={(e: any, d: any) =>
              setTo(currencies.find((x) => x.name === e.target.value))
            }
          >
            <MenuItem>{"-"}</MenuItem>
            {currencies
              .filter((x) => x.name !== from?.name)
              .map((currency, i) => (
                <MenuItem key={currency.name + "_to"} value={currency.name}>
                  {currency.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      {isValid && (
        <Typography>{`1 ${from?.unit} of ${from?.name} = ${Number(rateValue)} ${
          to?.unit
        } of ${to?.name}`}</Typography>
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
    </Box>
  );
}

export function SetupExchangeRates() {
  const db = useDBContext();
  const rates = useObservable(db.getExchangeRates(), []);
  return (
    <Box display={"flex"} flexDirection={"column"}>
      {rates.map((rate, i) => (
        <Item
          key={rate.from.name + "_" + rate.to.name + "_" + rate.rate}
          rate={rate}
          isNew={false}
        />
      ))}
      <Item key={rates.length} isNew={true} />
    </Box>
  );
}
