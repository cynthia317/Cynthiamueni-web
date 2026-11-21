import { describe, expect, it } from "vitest";
import { SERVICES } from "@/lib/data/services";
import { getServices } from "@/lib/content/services";

describe("lib/content/services", () => {
  it("returns every service from the static source, in display order", async () => {
    const services = await getServices();
    expect(services).toEqual(SERVICES);
    expect(services.map((service) => service.id)).toEqual(["osh", "software", "digital"]);
  });

  it("returns a new array so callers cannot reorder the source", async () => {
    const services = await getServices();
    services.reverse();
    expect((await getServices())[0].id).toBe("osh");
  });
});
