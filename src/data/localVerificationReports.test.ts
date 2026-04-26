import { describe, expect, it } from "vitest";
import { buildLocalVerificationReports } from "./localVerificationReports";

describe("buildLocalVerificationReports", () => {
  it("groups verification assets by feature folder", () => {
    const reports = buildLocalVerificationReports([
      {
        path: "../../verification/login-name-email/login-signed-in.png",
        url: "/assets/login-signed-in.png",
      },
      {
        path: "../../verification/login-name-email/ship-report.png",
        url: "/assets/ship-report.png",
      },
      {
        path: "../../verification/dashboard/modal-open.snapshot.txt",
        text: "uid=1 RootWebArea",
      },
    ]);

    expect(reports).toHaveLength(2);
    expect(reports[0]).toMatchObject({
      id: "dashboard",
      title: "Dashboard",
      artifacts: [{ name: "modal-open.snapshot.txt", preview: "uid=1 RootWebArea" }],
    });
    expect(reports[1]).toMatchObject({
      id: "login-name-email",
      title: "Login Name Email",
      images: [
        { caption: "Login Signed In", src: "/assets/login-signed-in.png" },
        { caption: "Ship Report", src: "/assets/ship-report.png" },
      ],
    });
  });

  it("uses report metadata when a verification folder includes report.json", () => {
    const reports = buildLocalVerificationReports([
      {
        path: "../../verification/auth-flow/report.json",
        text: JSON.stringify({
          title: "Auth flow verification",
          summary: "Validated the local auth happy path and logout.",
        }),
      },
      {
        path: "../../verification/auth-flow/01-after-login.png",
        url: "/assets/01-after-login.png",
      },
    ]);

    expect(reports).toEqual([
      expect.objectContaining({
        id: "auth-flow",
        title: "Auth flow verification",
        summary: "Validated the local auth happy path and logout.",
      }),
    ]);
  });
});
