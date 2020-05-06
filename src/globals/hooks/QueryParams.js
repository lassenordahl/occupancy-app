import { useLocation } from "react-router-dom";

function QueryParams() {

  let queryParams = {};

  let query = new URLSearchParams(useLocation().search);

  if (query.get("currentDate"))
    queryParams.currentDate = query.get("currentDate");
  if (query.get("fromDate"))
    queryParams.fromDate = query.get("fromDate");
  if (query.get("toDate"))
    queryParams.toDate = query.get("toDate");

  return queryParams;
}

export default QueryParams;