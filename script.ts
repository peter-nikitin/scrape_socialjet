import axios from "axios";
import fs from "fs";
import { Parser, transforms } from "json2csv";

const getPage = (page: number, pageSize = 50) =>
  axios.get(
    `
    https://data-api.socialjet.pro/api-dev/v1/group-telegram?subscriberCountries[]=%D0%A3%D0%B7%D0%B1%D0%B5%D0%BA%D0%B8%D1%81%D1%82%D0%B0%D0%BD&viewsType=last24h&priceType=post&postsType=last24h&growType=month&page-size=${pageSize}&page=${page}&sortBy=subscribersCount&sortDirection=desc`,
    {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "ru,en;q=0.9,ru-RU;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "cache-control": "no-cache",
        pragma: "no-cache",
        "sec-ch-ua":
          '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-api-key": "28c0a0fdb94f3256b76463c52cb808ed",
        Referer: "https://data.socialjet.pro/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    }
  );

const fields = [
  "postsStatistic",
  "viewsStatistic",
  "commentsStatistic",
  "subscribersStatistic",
  "postPrice",
  "categories",
  "id",
  "social",
  "name",
  "url",
  "description",
  "status",
  "cpm",
  "er",
  "isArchived",
  "isBlogger",
  "tags",
  "avatar",
  "updatedTimestamp",
  "createdTimestamp",
  "updatedAt",
  "createdAt",
  "integrationPrice",
  "sourceId",
  "contentAnalysis",
  "placementInTop",
  "placementInFeed",
  "advertisingLabel",
  "inspectReport",
];

const parser = new Parser({
  // header: false,
  transforms: [
    transforms.flatten({ separator: "__" }),
    transforms.unwind({
      paths: ["categories", "subscribersStatistic.countries"],
    }),
  ],
});
//

const getData = async () => {
  let hasNext = true;
  let pageIndex = 1;

  while (hasNext) {
    try {
      const page = await getPage(pageIndex, 2000);
      hasNext = false;
      if (page?.data?.data?.length > 0) {
        hasNext = true;
        pageIndex += 1;
        fs.appendFileSync("./data.csv", parser.parse(page?.data?.data));
      }
      console.log(`done page ${pageIndex}. has next: ${hasNext}`);
    } catch (error) {
      hasNext = false;
      console.log(error);
    }
  }
};

getData();

const raw = {
  postsStatistic: {
    countLastMonth: 1313,
    countLastWeek: 326,
    averagePerDay: null,
    countLast24h: 58,
    countLast48h: null,
    countLast72h: null,
    averagePerMonth: null,
    total: null,
  },
  viewsStatistic: {
    countLastMonth: null,
    countLastWeek: null,
    averagePerDay: 810000,
    countLast24h: 1000000,
    countLast48h: 1135768,
    countLast72h: 1178485,
    averagePerMonth: null,
    total: null,
  },
  commentsStatistic: {
    countLastMonth: null,
    countLastWeek: null,
    averagePerDay: null,
    countLast24h: null,
    countLast48h: null,
    countLast72h: null,
    averagePerMonth: null,
    total: null,
  },
  subscribersStatistic: {
    count: 4187735,
    femalePercent: 50,
    malePercent: 50,
    cities: null,
    countries: [{ location: "Россия", value: null }],
    monthGrow: 91746,
    dayGrow: 4355,
  },
  postPrice: { sell: "306666.67" },
  categories: [{ id: 999, name: "Другое" }],
  id: 53690,
  social: "telegram",
  name: "Топор 18+",
  url: "https://t.me/joinchat/ScL1FOCgJCbFNJK1",
  description:
    "Самый просматриваемый русскоязычный Telegram канал.Новости присылать сюда: @Toporchan_BotLive канал – https://t.me/+oDf_lVJzbNQyYWFiОткрытый канал – @toporПо вопросам сотрудничества: @toporchТопор ВК: https://vk.com/toportg",
  status: 1,
  cpm: 306.67,
  er: 24,
  isArchived: false,
  isBlogger: false,
  tags: [],
  avatar:
    "//static10.tgstat.ru/channels/_0/f8/f8e6b17a4a73428a05c4cc922ab9fdc0.jpg",
  updatedTimestamp: 1659164732,
  createdTimestamp: 1655633326,
  updatedAt: {
    date: "2022-07-30 10:05:32.000000",
    timezone_type: 3,
    timezone: "Europe/Moscow",
  },
  createdAt: {
    date: "2022-06-19 13:08:46.000000",
    timezone_type: 3,
    timezone: "Europe/Moscow",
  },
  integrationPrice: { sell: null },
  sourceId: null,
  contentAnalysis: {
    erotic: "0.00",
    violence: "20.00",
    swearing: "5.00",
    cleanContentScore: "8.00",
  },
  placementInTop: null,
  placementInFeed: null,
  advertisingLabel: null,
  inspectReport: null,
};
