# https-proxies

A http/https proxies list that update every 2 hours

## Setup

Uncomment the schedule part in the workflow

## Website

See the proxy list as a table [here](https://yoannchb-pro.github.io/https-proxies/)

## Package

See the typescript package to get proxies with custom filters [here](https://github.com/yoannchb-pro/https-proxies/tree/main/package)

## BOT LOGS

Generation logs [here](./bot.logs)

```txt
Last update: {%= new Date(data.lastUpdate) %}
Number of proxy: {%= data.count %}
Number of https proxy: {%= httpsProxiesLength %}
Number of http proxy: {%= httpProxiesLength %}
Number of proxy by Anonymity: Unknown -> {%= anonymity.unknown %}, Low -> {%= anonymity.low %}, Average -> {%= anonymity.average %}, High -> {%= anonymity.high %}
Average speed: {%= averageSpeed %} ms
Countries ({%= countries.length %}): {%= countries.join(", ") %}
Success ({%= data.successList.length %}):
{%_ for(const success of data.successList){ %}
  - {%= success _%}
{%_ } %}
Failed ({%= data.failedList.length %}):
{%_ for(const failed of data.failedList){ %}
  - {%= failed _%}
{%_ } %}
```

## Type

### JSON type

- lastUpdate: Date of the last update
- count: Number of proxies
- successList: List of url scrapped with success
- failedList: List of url scrapped without success
- proxies: List of proxy

```ts
type JSONProxy = {
  lastUpdate: string;
  count: number;
  successList: string[];
  failedList: string[];
  proxies: Proxy[];
};
```

### Proxy type

- speed: Speed time in ms (can be null)

```ts
enum Anonymity {
  UNKNOWN = 0,
  LOW = 1,
  AVERAGE = 2,
  HIGH = 3,
}

type Proxy = {
  ip: string;
  port: number;
  country: string;
  anonymity: Anonymity;
  https: boolean;
  speed: number;
};
```

## Quick Access

### JSON

```
$ curl "https://raw.githubusercontent.com/yoannchb-pro/https-proxies/main/proxies.json" > proxies.json
```

### CSV

```
$ curl "https://raw.githubusercontent.com/yoannchb-pro/https-proxies/main/proxies.csv" > proxies.csv
```

### Text

```
$ curl "https://raw.githubusercontent.com/yoannchb-pro/https-proxies/main/proxies.txt" > proxies.txt
```
