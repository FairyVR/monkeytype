import { fireEvent, render, screen } from "@solidjs/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getfpsLimit, setfpsLimit } from "../../../src/ts/anim";
import { TheRestModal } from "../../../src/ts/components/modals/TheRestModal";
import {
  getGlarsesMode,
  setGlarsesMode,
} from "../../../src/ts/states/glarses-mode";
import { showModal } from "../../../src/ts/states/modals";
import {
  getSmoothedBurst,
  setSmoothedBurst,
} from "../../../src/ts/states/result";
import {
  getSarcasticResultMessage,
  setSarcasticResultMessage,
} from "../../../src/ts/states/sarcastic-result-message";

describe("components/modals/TheRestModal.tsx", () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.show = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    setSarcasticResultMessage(false);
    setGlarsesMode(true);
    setSmoothedBurst(false);
    setfpsLimit(60);
    showModal("TheRest");
    render(() => <TheRestModal />);
  });

  it.each([
    ["sarcastic result message", [true, true, false, 60]],
    ["glarses mode", [false, false, false, 60]],
    ["smoothed burst", [false, true, true, 60]],
    ["animation fps limit", [false, true, false, 1000]],
  ])("resets only %s", (name, expected) => {
    fireEvent.click(screen.getByLabelText(`reset ${name} to default`));
    expect([
      getSarcasticResultMessage(),
      getGlarsesMode(),
      getSmoothedBurst(),
      getfpsLimit(),
    ]).toEqual(expected);
  });

  it("restores invalid input even when the stored value is already default", () => {
    const reset = screen.getByLabelText("reset animation fps limit to default");
    fireEvent.click(reset);
    const input = screen.getByRole("spinbutton", { hidden: true });
    fireEvent.input(input, { target: { value: "1" } });
    fireEvent.blur(input);
    expect(input).toHaveClass("text-error");

    fireEvent.click(reset);
    expect(input).toHaveValue(1000);
    expect(input).not.toHaveClass("text-error");
    expect(getfpsLimit()).toBe(1000);
  });

  it("still resets all settings together", () => {
    fireEvent.click(screen.getByText("reset to default"));
    expect([
      getSarcasticResultMessage(),
      getGlarsesMode(),
      getSmoothedBurst(),
      getfpsLimit(),
    ]).toEqual([true, false, true, 1000]);
  });
});
