import React from "react";
import { Currency, newUuid, usePLSDBContext } from "../../data/PLSDB";
import { useObservable } from "../../Utils";
import {
  Box,
  Icon,
  Checkbox,
  Button,
  TextField,
  Typography,
  Card,
} from "@material-ui/core";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";

function CurrencyItem({
  currency,
  isNew,
}: {
  currency: Currency;
  isNew: boolean;
}) {
  const db = usePLSDBContext();
  const [name, setName] = React.useState(() => currency.name);
  const [icon, setIcon] = React.useState(() => currency.icon);
  const [isSource, setIsSource] = React.useState(() => currency.isSource);
  const [unit, setUnit] = React.useState(() => currency.unit);
  const isSmallScreen = useIsSmallScreen();
  const isEdited =
    name !== currency.name ||
    icon !== currency.icon ||
    unit !== currency.unit ||
    isSource !== currency.isSource;

  const content = (
    <>
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
        label={"Unit"}
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      />
      <Typography>{"Is time"}</Typography>
      <Checkbox checked={isSource} onChange={(e, v) => setIsSource(v)} />
      <Typography>{"Is source"}</Typography>
      {isEdited && (
        <Button
          onClick={() => {
            db.addOrUpdateCurrency({
              name,
              icon,
              unit,
              isSource,
              id: currency.id,
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
    </>
  );

  if (isSmallScreen)
    return (
      <Card style={{ margin: 15 }}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"space-between"}
          padding={1}
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

export function SetupCurrencies() {
  const db = usePLSDBContext();
  const currencies = useObservable(db.getCurrencies(), []);
  return (
    <Box display={"flex"} flexDirection={"column"}>
      {currencies.map((currency, i) => (
        <CurrencyItem key={currency.name} currency={currency} isNew={false} />
      ))}
      <CurrencyItem
        key={`new_currency_item_${currencies.length}`}
        currency={{
          name: `New currency ${currencies.length + 1}`,
          icon: "",
          isSource: false,
          id: newUuid(),
          unit: "hour",
        }}
        isNew={true}
      />
    </Box>
  );
}
