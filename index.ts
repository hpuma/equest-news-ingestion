import { EquestApi } from "./equest";

async function main() {
  const equestApi = new EquestApi();
  const { data } = await equestApi.findNewsRecordByHash("testhash123");

  console.log(data);
}

main();
