import { ResponseStatus } from "./Interfaces";
import Marketplace from "./Classes/Marketplace";

(async () => {
  const marketplace = new Marketplace();
  marketplace.fetchAllLatest().then((data) => {
    //   if(data.status == ResponseStatus.OK)
  });
  marketplace.fetchLatestMonthly().then((data) => console.log(data));
  marketplace.fetchLatestPerm().then((data) => console.log(data));
})();
