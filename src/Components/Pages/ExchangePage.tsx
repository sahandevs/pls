import React from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Card,
  MenuItem,
  Menu,
} from "@material-ui/core";
import { useDBContext, Currency, ExchangeRate } from "../../data/DB";
import { useObservable } from "../../Utils";
type ExchangeButtonBaseProps = {
  exchangeRate: ExchangeRate;
  value: number;
  onDone: () => void;
  innerRef: any;
};
function ExchangeButtonBase({
  exchangeRate,
  value,
  onDone,
  innerRef,
}: ExchangeButtonBaseProps) {
  const db = useDBContext();
  const canExchange = useObservable(db.canExchange(exchangeRate, value), false);
  return (
    <MenuItem
      disabled={!canExchange}
      innerRef={innerRef}
      onClick={() => {
        db.exchange(exchangeRate, value);
        onDone();
      }}
    >{`1 ${exchangeRate.from.unit} of ${exchangeRate.from.name} to ${
      value * exchangeRate.rate
    } ${exchangeRate.to.unit} of ${exchangeRate.to.name}`}</MenuItem>
  );
}

const ExchangeButton = React.forwardRef((props: Omit<ExchangeButtonBaseProps, "innerRef">, ref) => (
  <ExchangeButtonBase {...props} innerRef={ref} />
));

function ExchangeItem({ currency }: { currency: Currency }) {
  const db = useDBContext();
  const exchangeRates = useObservable(db.getExchangeRates(), []);
  const currentValue = useObservable(db.bankOf(currency), 0);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card variant={"outlined"} style={{ margin: 3 }}>
      <Box padding={2} display={"flex"} flexDirection={"column"}>
        <Typography>{`${currentValue} ${currency.unit} of ${currency.name}`}</Typography>
        <Button
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-controls="menu"
          aria-haspopup="true"
        >
          {"Exchange"}
        </Button>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={anchorEl != null}
          onClose={handleClose}
        >
          {exchangeRates
            .filter((x) => x.from.name === currency.name)
            .map((item) => (
              <ExchangeButton
                key={item.from.name + "_" + item.to.name}
                exchangeRate={item}
                value={1}
                onDone={handleClose}
              />
            ))}
        </Menu>
        <Box display={"flex"} flexDirection={"row"}>
          <Button onClick={(event) => db.addToBank(currency, 1)}>{"+1"}</Button>
          <Button onClick={(event) => db.addToBank(currency, -1)}>
            {"-1"}
          </Button>
        </Box>
      </Box>
    </Card>
  );
}

function SpendItem({ currency }: { currency: Currency }) {
  const db = useDBContext();
  const currentValue = useObservable(db.bankOf(currency), 0);
  const canSpend1 = useObservable(db.canSpend(currency, 1), false);
  const exchangeRates = useObservable(db.getExchangeRates(), []).filter(
    (x) => x.from.name === currency.name
  );
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card variant={"outlined"} style={{ margin: 3 }}>
      <Box padding={2} display={"flex"} flexDirection={"column"}>
        <Typography>{`${currentValue} ${currency.unit} of ${currency.name}`}</Typography>
        {exchangeRates.length > 0 && (
          <>
            <Button
              onClick={(event) => setAnchorEl(event.currentTarget)}
              aria-controls="menu"
              aria-haspopup="true"
            >
              {"Exchange"}
            </Button>
            <Menu
              id="menu"
              anchorEl={anchorEl}
              keepMounted
              open={anchorEl != null}
              onClose={handleClose}
            >
              {exchangeRates
                .filter((x) => x.from.name === currency.name)
                .map((item) => (
                  <ExchangeButton
                    key={item.from.name + "_" + item.to.name}
                    exchangeRate={item}
                    value={1}
                    onDone={handleClose}
                  />
                ))}
            </Menu>
          </>
        )}
        <Button
          disabled={!canSpend1}
          onClick={() => db.addToBank(currency, -1)}
        >{`Spend 1 ${currency.unit}`}</Button>
      </Box>
    </Card>
  );
}

export function ExchangePage() {
  const db = useDBContext();
  const currencies = useObservable(db.getCurrencies(), []);

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Typography variant={"h5"}>{"Exchange"}</Typography>
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        flexDirection={"row"}
        justifyContent={"center"}
      >
        {currencies
          .filter((x) => x.isSource)
          .map((currency) => (
            <ExchangeItem key={currency.name} currency={currency} />
          ))}
      </Box>
      <Divider variant={"middle"} />
      <Typography variant={"h5"}>{"Spend"}</Typography>
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        flexDirection={"row"}
        justifyContent={"center"}
      >
        {currencies
          .filter((x) => !x.isSource)
          .map((currency) => (
            <SpendItem key={currency.name} currency={currency} />
          ))}
      </Box>
    </Box>
  );
}
