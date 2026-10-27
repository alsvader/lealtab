import { describe, expect, it } from "vitest";
import { sellosValidos } from "./tarjeta";

describe("sellosValidos", () => {
  it("acepta enteros de 4 a 12", () => {
    expect(sellosValidos(4)).toBe(4);
    expect(sellosValidos("12")).toBe(12);
    expect(sellosValidos(3)).toBeNull();
    expect(sellosValidos(13)).toBeNull();
    expect(sellosValidos(8.5)).toBeNull();
  });
});
