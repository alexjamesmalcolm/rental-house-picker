import { assertArraySymmetry } from "./better-assert-array-symmetry";

describe("assertArraySymmetry", () => {
  it("should match simple example", () => {
    const a: string[] = ["a", "b"];
    const b: string[] = ["b", "a"];
    const isSymmetrical: boolean = assertArraySymmetry(a, b);
    expect(isSymmetrical).toBeTruthy();
  });
  it("should match example", () => {
    const a: string[][] = [
      ["a", "b"],
      ["a", "c", "c"],
    ];
    const b: string[][] = [
      ["c", "a", "c"],
      ["a", "b"],
    ];
    const isSymmetrical: boolean = assertArraySymmetry(a, b);
    expect(isSymmetrical).toBeTruthy();
  });
  it("should not match example", () => {
    const a: string[][] = [
      ["a", "b"],
      ["a", "c", "c"],
    ];
    const b: string[][] = [
      ["c", "a", "d"],
      ["a", "b"],
    ];
    const isSymmetrical: boolean = assertArraySymmetry(a, b);
    expect(isSymmetrical).toBeFalsy();
  });
});
