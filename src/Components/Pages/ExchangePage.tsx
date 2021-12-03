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
import { usePLSDBContext, Currency, ExchangeRate } from "../../data/PLSDB";
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
  const db = usePLSDBContext();
  const canExchange = useObservable(db.canExchange(exchangeRate, value), false);
  return (
    <MenuItem
      disabled={!canExchange}
      innerRef={innerRef}
      onClick={() => {
        db.exchange(exchangeRate, value);
        onDone();
      }}
    >{`1 ${db.getCurrency(exchangeRate.from)!.unit} of ${
      db.getCurrency(exchangeRate.from)!.name
    } to ${value * exchangeRate.rate} ${
      db.getCurrency(exchangeRate.to)!.unit
    } of ${db.getCurrency(exchangeRate.to)!.name}`}</MenuItem>
  );
}

const ExchangeButton = React.forwardRef(
  (props: Omit<ExchangeButtonBaseProps, "innerRef">, ref) => (
    <ExchangeButtonBase {...props} innerRef={ref} />
  )
);

function ExchangeItem({
  currency,
  filter,
}: {
  currency: Currency;
  filter: string;
}) {
  const db = usePLSDBContext();
  const exchangeRates = useObservable(db.getExchangeRates(), []);
  const currentValue = useObservable(db.bankOf(currency.id), 0);
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card variant={"outlined"} style={{ margin: 3 }}>
      <Box padding={2} display={"flex"} flexDirection={"column"}>
        <Typography>
          {`${currentValue} ${currency.unit} of `}
          <span
            dangerouslySetInnerHTML={{
              __html: currency.name
                .toLowerCase()
                .replace(
                  filter,
                  `<span style="background-color:yellow">${filter}</span>`
                ),
            }}
          ></span>
        </Typography>
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
            .filter((x) => x.from === currency.id)
            .map((item) => (
              <ExchangeButton
                key={item.from + "_" + item.to}
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

function SpendItem({
  currency,
  filter,
}: {
  currency: Currency;
  filter: string;
}) {
  const db = usePLSDBContext();
  const currentValue = useObservable(db.bankOf(currency.id), 0);
  const canSpend1 = useObservable(db.canSpend(currency, 1), false);
  const exchangeRates = useObservable(db.getExchangeRates(), []).filter(
    (x) => x.from === currency.id
  );
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Card variant={"outlined"} style={{ margin: 3 }}>
      <Box padding={2} display={"flex"} flexDirection={"column"}>
        <Typography>
          {`${currentValue} ${currency.unit} of `}
          <span
            dangerouslySetInnerHTML={{
              __html: currency.name
                .toLowerCase()
                .replace(
                  filter,
                  `<span style="background-color:yellow">${filter}</span>`
                ),
            }}
          ></span>
        </Typography>
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
                .filter((x) => x.from === currency.id)
                .map((item) => (
                  <ExchangeButton
                    key={item.from + "_" + item.to}
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
  const db = usePLSDBContext();
  const currencies = useObservable(db.getCurrencies(), []);
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          setSearch("");
          break;
        case "Backspace":
          setSearch((x) => x.slice(0, -1));
          break;
        default:
          if (e.key.length === 1) setSearch((x) => x + e.key);
          break;
      }
    };
    document.addEventListener("keydown", eventHandler);
    return () => document.removeEventListener("keydown", eventHandler);
  }, [setSearch]);

  const isInFilter = (x) => x.name.toLowerCase().match(search.toLowerCase());

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <Typography variant={"h5"}>{"Exchange"}</Typography>
      <Typography variant={"body2"}>{search}</Typography>
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        flexDirection={"row"}
        justifyContent={"center"}
      >
        {currencies
          .filter((x) => x.isSource && isInFilter(x))
          .map((currency) => (
            <ExchangeItem
              key={currency.id}
              currency={currency}
              filter={search}
            />
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
          .filter((x) => !x.isSource && isInFilter(x))
          .map((currency) => (
            <SpendItem key={currency.id} currency={currency} filter={search} />
          ))}
      </Box>
    </Box>
  );
}
