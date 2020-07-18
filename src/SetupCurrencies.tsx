import React from "react";
import { Currency, useDBContext } from "./data/DB";
import { useObservable } from "./Utils";
import {
  Box,
  Icon,
  Checkbox,
  Button,
  TextField,
  Typography,
} from "@material-ui/core";

function CurrencyItem({
  currency,
  isNew,
}: {
  currency: Currency;
  isNew: boolean;
}) {
  const db = useDBContext();
  const [name, setName] = React.useState(() => currency.name);
  const [icon, setIcon] = React.useState(() => currency.icon);
  const [description, setDescription] = React.useState(
    () => currency.description
  );
  const [isSource, setIsSource] = React.useState(() => currency.isSource);
  const [isTime, setIsTime] = React.useState(() => currency.isTime);
  const [unit, setUnit] = React.useState(() => currency.unit);

  const isEdited =
    name !== currency.name ||
    icon !== currency.icon ||
    description !== currency.description ||
    isTime !== currency.isTime ||
    unit !== currency.unit ||
    isSource !== currency.isSource;

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      margin={1}
      justifyContent={"space-between"}
    >
      {!isNew && <Icon>{currency.icon}</Icon>}
      {isNew && (
        <TextField
          label={"Icon"}
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
        />
      )}
      <TextField
        label={"Name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label={"Description"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        label={"Unit"}
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      />

      <Checkbox checked={isTime} onChange={(e, v) => setIsTime(v)} />
      <Typography>{"Is time"}</Typography>
      <Checkbox checked={isSource} onChange={(e, v) => setIsSource(v)} />
      <Typography>{"Is source"}</Typography>
      {isEdited && (
        <Button
          onClick={() => {
            db.addOrUpdateCurrency({
              name,
              icon,
              description,
              isTime,
              unit,
              isSource,
            });
          }}
        >
          <Icon>{"save"}</Icon>
        </Button>
      )}

      {!isNew && (
        <Button
          onClick={() => {
            db.removeCurrency(currency);
          }}
        >
          <Icon>{"delete"}</Icon>
        </Button>
      )}
    </Box>
  );
}

export function SetupCurrencies() {
  const db = useDBContext();
  const currencies = useObservable(db.getCurrencies(), []);
  return (
    <Box display={"flex"} flexDirection={"column"}>
      {currencies.map((currency, i) => (
        <CurrencyItem key={currency.name} currency={currency} isNew={false} />
      ))}
      <CurrencyItem
        key={`new_currency_item`}
        currency={{
          name: `New currency ${currencies.length + 1}`,
          description: "",
          icon: "",
          isSource: false,
          isTime: false,
          unit: "hour",
        }}
        isNew={true}
      />
    </Box>
  );
}
