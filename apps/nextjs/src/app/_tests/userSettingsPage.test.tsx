import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

import AccountSettings from "../_components/_userSettingsPage/AccountSettings";
import Layout from "../layout";

beforeEach(cleanup);

describe("User Account Lanuage", () => {
  test("renders", () => {
    render(
      <Layout>
        <AccountSettings walletId="12345" language="English" theme={true} />,
      </Layout>,
    );
    expect(screen.findAllByTitle("header")).toBeDefined();
    expect(screen.getByLabelText("Language")).toBeDefined();
  });
});
