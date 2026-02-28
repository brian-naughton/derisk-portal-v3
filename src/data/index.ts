import dao_2016 from "./dao_2016.json";
import wormhole_2022 from "./wormhole_2022.json";
import wormhole_solana_2022 from "./wormhole_solana_2022.json";
import euler_2023 from "./euler_2023.json";
import beanstalk_2022 from "./beanstalk_2022.json";
import mango_2022 from "./mango_2022.json";
import balancer_2025 from "./balancer_2025.json";
import makina_2026 from "./makina_2026.json";

export const exploitsMap: Record<string, any> = {
  "dao_2016": dao_2016,
  "wormhole_2022": wormhole_2022,
  "wormhole_solana_2022": wormhole_solana_2022,
  "euler_2023": euler_2023,
  "beanstalk_2022": beanstalk_2022,
  "mango_2022": mango_2022,
  "balancer_2025": balancer_2025,
  "makina_2026": makina_2026,
};

export const exploitsList = Object.keys(exploitsMap);
